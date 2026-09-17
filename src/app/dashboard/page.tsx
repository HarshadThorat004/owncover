import Link from "next/link";
import {
  Package,
  ShieldCheck,
  ShieldAlert,
  Clock,
  Plus,
  Download,
  CalendarDays,
  Inbox,
} from "lucide-react";

import AnimatedCounter from "@/components/animated-counter";
import DashboardOverview from "@/components/dashboard-overview";
import FirstRunOnboarding from "@/components/first-run-onboarding";
import ProductSearch from "@/components/product-search";
import DashboardShell from "@/components/dashboard-shell";

import { getSessionUser } from "@/lib/product-access";
import {
  getCoverageStatus,
  getEffectiveCover,
} from "@/lib/coverage";
import { getMembership } from "@/lib/household";
import { listPendingInboundDrafts } from "@/lib/inbound";
import { getDaysRemaining } from "@/lib/warranty";
import { getDashboardCounts, listProductsForUser } from "@/lib/products-query";
import { isMissingSerial } from "@/lib/weekly-digest";

export default async function DashboardPage() {
  const user = await getSessionUser();

  if (!user) {
    return null;
  }

  const [{ items: products }, counts, membership, inboundDrafts] =
    await Promise.all([
      listProductsForUser(user.id, { limit: 50 }),
      getDashboardCounts(user.id),
      getMembership(user.id),
      listPendingInboundDrafts(user.id),
    ]);

  const expiringProducts = products.filter(
    (product) => getCoverageStatus(product) === "expiring"
  );
  const missingSerialProducts = products.filter((product) =>
    isMissingSerial(product.serialNumber)
  );
  const attentionItems = new Map<
    string,
    { product: (typeof products)[number]; reasons: string[] }
  >();

  for (const product of expiringProducts) {
    const cover = getEffectiveCover(product);
    const daysRemaining = cover ? getDaysRemaining(cover.date) : null;
    attentionItems.set(product.id, {
      product,
      reasons: [
        daysRemaining != null
          ? `${daysRemaining}d left · ${cover?.label ?? "cover"}`
          : "Cover ending within 30 days",
      ],
    });
  }

  for (const product of missingSerialProducts) {
    const existing = attentionItems.get(product.id);
    const reason = "Serial missing — the desk will ask";
    if (existing) existing.reasons.push(reason);
    else attentionItems.set(product.id, { product, reasons: [reason] });
  }

  const needsYou = [...attentionItems.values()];

  const firstName = user.name?.split(" ")[0] || "there";
  const emptyVault = products.length === 0;

  return (
    <DashboardShell>
      <div className="flex flex-col gap-10">
        <section className="pb-2">
          <p className="text-sm text-gray-400">Welcome back, {firstName}</p>
          <div className="mt-3 flex flex-col gap-6 md:flex-row md:items-end md:justify-between">
            <div className="max-w-xl">
              <h1 className="font-display text-3xl text-white md:text-5xl">
                {membership && membership.household.members.length > 1
                  ? membership.household.name
                  : emptyVault
                    ? "Start your vault"
                    : "Coverage snapshot"}
              </h1>
              <p className="mt-3 text-sm leading-7 text-gray-500 md:text-base">
                {membership && membership.household.members.length > 1
                  ? `Shared vault · ${membership.household.members.length} people. Products, documents, and expiry dates together.`
                  : emptyVault
                    ? "Scan a GST bill, or load a sample TV and download a pack in one minute."
                    : "Active cover, missing serials, dates that need a desk visit, and invoices still in draft."
              </p>
              {membership && membership.household.members.length > 1 && (
                <Link
                  href="/dashboard/settings"
                  className="mt-3 inline-block text-sm text-cyan-300/90 underline-offset-2 hover:underline"
                >
                  Manage vault
                </Link>
              )}
            </div>

            <Link
              href="/dashboard/add-product"
              className="premium-btn premium-btn-solid inline-flex items-center gap-2 rounded-xl bg-white px-5 py-3 text-sm font-semibold text-black"
            >
              <Plus size={16} />
              Add product
            </Link>
          </div>
        </section>

        {inboundDrafts.length > 0 && (
          <section className="rounded-2xl border border-cyan-500/20 bg-cyan-500/[0.06] p-5 md:p-6">
            <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
              <div className="flex items-start gap-3">
                <Inbox size={18} className="mt-0.5 text-cyan-300" />
                <div>
                  <h2 className="text-base font-medium text-white">
                    Work queue · {inboundDrafts.length}{" "}
                    {inboundDrafts.length === 1 ? "invoice" : "invoices"} to confirm
                  </h2>
                  <p className="mt-1 text-sm text-gray-500">
                    Forwarded attachments stay drafts until you confirm the dates.
                  </p>
                </div>
              </div>
              <Link
                href={`/dashboard/add-product?draft=${inboundDrafts[0]!.id}`}
                className="premium-btn premium-btn-solid inline-flex items-center justify-center rounded-xl bg-white px-4 py-2.5 text-sm font-semibold text-black"
              >
                Review
              </Link>
            </div>
          </section>
        )}

        {emptyVault ? (
          <FirstRunOnboarding />
        ) : (
          <>
        {/* Stats */}
        <section className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          <div className="premium-card rounded-2xl border border-white/10 bg-neutral-950/80 p-5">
            <div className="flex items-center justify-between">
              <p className="text-xs uppercase tracking-[0.14em] text-gray-500">In vault</p>
              <Package size={16} className="text-gray-600" />
            </div>
            <p className="mt-3 font-display text-3xl tracking-tight text-white">
              <AnimatedCounter value={counts.totalProducts} />
            </p>
          </div>

          <div className="premium-card rounded-2xl border border-white/10 bg-neutral-950/80 p-5">
            <div className="flex items-center justify-between">
              <p className="text-xs uppercase tracking-[0.14em] text-gray-500">Active cover</p>
              <ShieldCheck size={16} className="text-emerald-500" />
            </div>
            <p className="mt-3 font-display text-3xl tracking-tight text-emerald-400">
              <AnimatedCounter value={counts.activeProducts} />
            </p>
          </div>

          <div className="premium-card rounded-2xl border border-white/10 bg-neutral-950/80 p-5">
            <div className="flex items-center justify-between">
              <p className="text-xs uppercase tracking-[0.14em] text-gray-500">Needs attention</p>
              <Clock size={16} className="text-amber-500" />
            </div>
            <p className="mt-3 font-display text-3xl tracking-tight text-amber-400">
              <AnimatedCounter value={counts.attentionProducts} />
            </p>
          </div>

          <div className="premium-card rounded-2xl border border-white/10 bg-neutral-950/80 p-5">
            <div className="flex items-center justify-between">
              <p className="text-xs uppercase tracking-[0.14em] text-gray-500">Cover ended</p>
              <ShieldAlert size={16} className="text-red-500" />
            </div>
            <p className="mt-3 font-display text-3xl tracking-tight text-red-400">
              <AnimatedCounter value={counts.expiredProducts} />
            </p>
          </div>
        </section>

        {/* Quick insights */}
        <DashboardOverview
          totalProducts={counts.totalProducts}
          activeProducts={counts.activeProducts}
          expiredProducts={counts.expiredProducts}
          expiringProducts={counts.expiringProducts}
          missingSerial={counts.missingSerial}
        />

        {needsYou.length > 0 && (
          <section className="rounded-2xl border border-amber-500/20 bg-amber-500/[0.06] p-5 md:p-6">
            <div className="mb-4 flex items-center justify-between gap-3">
              <div>
                <h2 className="text-base font-medium text-white">Needs you</h2>
                <p className="mt-1 text-sm text-gray-500">
                  Cover ending within 30 days, or a serial the desk will ask for
                </p>
              </div>
              <span className="rounded-full border border-amber-500/20 bg-amber-500/10 px-3 py-1 text-xs font-medium text-amber-200">
                {needsYou.length}
              </span>
            </div>

            <div className="space-y-2">
              {needsYou.map(({ product, reasons }) => (
                <Link
                  key={product.id}
                  href={`/dashboard/products/${product.id}`}
                  className="premium-card flex items-center justify-between rounded-xl border border-white/5 bg-black/30 px-4 py-3.5"
                >
                  <div>
                    <p className="text-sm font-medium text-white">
                      {product.name}
                    </p>
                    <p className="mt-0.5 text-xs text-gray-500">
                      {[product.brand || "Unknown brand", ...reasons]
                        .filter(Boolean)
                        .join(" · ")}
                    </p>
                  </div>
                  <span className="text-sm font-medium text-amber-300">
                    Open
                  </span>
                </Link>
              ))}
            </div>
          </section>
        )}

        <section id="products" className="space-y-4">
            <div className="flex flex-col gap-3 sm:flex-row sm:items-end sm:justify-between">
              <div>
                <h2 className="text-base font-medium text-white">
                  Your products
                </h2>
                <p className="mt-1 text-sm text-gray-500">
                  Filter by active cover, needs attention, or cover ended
                </p>
              </div>
              <div className="flex flex-wrap gap-2">
                <a
                  href="/api/exports?format=csv"
                  className="premium-ghost inline-flex items-center gap-2 rounded-xl border border-white/10 px-3 py-2 text-xs font-medium text-gray-300"
                >
                  <Download size={14} />
                  CSV
                </a>
                <a
                  href="/api/exports?format=ics"
                  className="premium-ghost inline-flex items-center gap-2 rounded-xl border border-white/10 px-3 py-2 text-xs font-medium text-gray-300"
                >
                  <CalendarDays size={14} />
                  Calendar
                </a>
              </div>
            </div>
            <ProductSearch products={products} />
          </section>
          </>
        )}
      </div>
    </DashboardShell>
  );
}
