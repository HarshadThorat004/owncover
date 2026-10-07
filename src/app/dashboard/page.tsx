import dynamic from "next/dynamic";
import { cookies } from "next/headers";
import Link from "next/link";
import { Suspense } from "react";
import {
  Package,
  ShieldCheck,
  ShieldAlert,
  Clock,
  Plus,
  Download,
  CalendarDays,
} from "lucide-react";

import AnimatedCounter from "@/components/animated-counter";
import DashboardOverview from "@/components/dashboard-overview";
import FirstRunOnboarding from "@/components/first-run-onboarding";
import InboundInbox from "@/components/inbound-inbox";
import InstallAppHint from "@/components/install-app-hint";
const ProductSearch = dynamic(() => import("@/components/product-search"), {
  loading: () => (
    <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
      {[1, 2, 3, 4, 5, 6].map((item) => (
        <div
          key={item}
          className="h-52 animate-pulse rounded-2xl border border-white/10 bg-neutral-950/80 motion-reduce:animate-none"
        />
      ))}
    </div>
  ),
});
import DashboardShell from "@/components/dashboard-shell";
import Reveal from "@/components/reveal";

import { getAuthSession } from "@/lib/auth";
import {
  attentionLabel,
  DASHBOARD_STRINGS,
  needsYouSubtitle,
} from "@/lib/dashboard-i18n";
import { LOCALE_COOKIE, parseLocale } from "@/lib/locale";
import { buildNeedsYouItems } from "@/lib/product-attention";
import {
  ensureInboundSlug,
  inboundAddressForSlug,
} from "@/lib/inbound";
import { MAX_HOUSEHOLD_MEMBERS } from "@/lib/household";
import { getDashboardHomeData } from "@/lib/products-query";

function DashboardHomeFallback() {
  return (
    <div className="animate-pulse motion-reduce:animate-none">
      <div className="mb-10 flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
        <div>
          <div className="h-10 w-52 rounded-xl bg-neutral-800" />
          <div className="mt-3 h-5 w-40 rounded-xl bg-neutral-800" />
        </div>
        <div className="h-12 w-40 rounded-xl bg-neutral-800" />
      </div>
      <div className="mb-10 grid gap-4 md:grid-cols-4">
        {[1, 2, 3, 4].map((item) => (
          <div
            key={item}
            className="rounded-2xl border border-white/10 bg-neutral-950/80 p-5"
          >
            <div className="h-4 w-24 rounded bg-neutral-800" />
            <div className="mt-4 h-10 w-16 rounded bg-neutral-800" />
          </div>
        ))}
      </div>
      <div className="h-14 rounded-2xl bg-neutral-900" />
    </div>
  );
}

export default function DashboardPage() {
  return (
    <DashboardShell>
      <Suspense fallback={<DashboardHomeFallback />}>
        <DashboardHome />
      </Suspense>
    </DashboardShell>
  );
}

async function DashboardHome() {
  const session = await getAuthSession();
  const userId = session?.user?.id;

  if (!userId) {
    return null;
  }

  const {
    items: products,
    statsRows,
    productsNextCursor,
    productsHasMore,
    counts,
    membership,
    inboundDrafts,
    inboundSlug,
  } = await getDashboardHomeData(userId);

  const emptyVault = products.length === 0;

  const inboundAddress =
    inboundSlug != null
      ? inboundAddressForSlug(inboundSlug)
      : emptyVault
        ? await ensureInboundSlug(userId)
            .then(inboundAddressForSlug)
            .catch((error) => {
              console.error(error);
              return null;
            })
        : null;

  const locale = parseLocale((await cookies()).get(LOCALE_COOKIE)?.value);
  const t = DASHBOARD_STRINGS[locale];
  const needsYou = buildNeedsYouItems(statsRows);
  const needsYouSubtitleText = needsYouSubtitle(needsYou, locale);

  const firstName = session.user?.name?.split(" ")[0] || "there";
  const sharedVault = (membership?.household.members.length ?? 0) > 1;

  return (
      <div className="flex flex-col gap-10">
        <section className="pb-2">
          <p className="text-sm text-gray-400">Welcome back, {firstName}</p>
          <div className="mt-3 flex flex-col gap-6 md:flex-row md:items-end md:justify-between">
            <div className="max-w-xl">
              <h1 className="font-display text-3xl text-white md:text-5xl">
                {sharedVault && membership
                  ? membership.household.name
                  : "Your vault"}
              </h1>
              <p className="mt-3 text-sm leading-7 text-gray-500 md:text-base">
                {sharedVault && membership
                  ? `Shared with ${membership.household.members.length} people. Same products, documents, and dates.`
                  : emptyVault
                    ? "Scan a GST invoice or enter the dates. Reminders start once you save."
                    : "What is covered, what is ending soon, and what still needs a serial."}
              </p>
              {sharedVault && membership && (
                <div className="mt-4 flex flex-wrap items-center gap-3">
                  <div className="flex -space-x-2">
                    {membership.household.members.map((member) => (
                      <span
                        key={member.id}
                        title={member.user.name || member.user.email}
                        className="flex h-8 w-8 items-center justify-center rounded-full border-2 border-[#030304] bg-neutral-800 text-xs font-semibold uppercase text-cyan-100"
                      >
                        {(member.user.name || member.user.email).trim().charAt(0)}
                      </span>
                    ))}
                  </div>
                  <Link
                    href="/dashboard/settings"
                    className="text-sm text-cyan-300/90 underline-offset-2 hover:underline"
                  >
                    {membership.role === "owner" &&
                    membership.household.members.length < MAX_HOUSEHOLD_MEMBERS
                      ? "Invite someone"
                      : "Manage vault"}
                  </Link>
                </div>
              )}
            </div>

            <Link
              href={emptyVault ? "/dashboard/add-product?focus=scan" : "/dashboard/add-product"}
              className="premium-btn premium-btn-solid inline-flex items-center gap-2 rounded-xl bg-white px-5 py-3 text-sm font-semibold text-black"
            >
              <Plus size={16} />
              Add product
            </Link>
          </div>
        </section>

        <InboundInbox drafts={inboundDrafts} />

        {emptyVault ? (
          <FirstRunOnboarding
            inboundAddress={inboundAddress}
            shared={sharedVault}
            locale={locale}
          />
        ) : (
          <>
        <InstallAppHint />
        <Reveal>
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
        </Reveal>

        <Reveal delay={0.06}>
        <DashboardOverview
          totalProducts={counts.totalProducts}
          activeProducts={counts.activeProducts}
          expiredProducts={counts.expiredProducts}
          expiringProducts={counts.expiringProducts}
          missingSerial={counts.missingSerial}
        />
        </Reveal>

        {needsYou.length > 0 && (
          <Reveal delay={0.1}>
          <section className="rounded-2xl border border-amber-500/20 bg-amber-500/[0.06] p-5 md:p-6">
            <div className="mb-4 flex items-center justify-between gap-3">
              <div>
                <h2 lang={locale} className="text-base font-medium text-white">{t.needsYou}</h2>
                <p lang={locale} className="mt-1 text-sm text-gray-500">
                  {needsYouSubtitleText}
                </p>
              </div>
              <span className="rounded-full border border-amber-500/20 bg-amber-500/10 px-3 py-1 text-xs font-medium text-amber-200">
                {needsYou.length}
              </span>
            </div>

            <div className="space-y-2">
              {needsYou.map(({ product, reason }) => (
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
                      {[product.brand || "Unknown brand", attentionLabel(reason, locale)]
                        .filter(Boolean)
                        .join(" · ")}
                    </p>
                  </div>
                  <span className="text-sm font-medium text-amber-300">
                    {t.open}
                  </span>
                </Link>
              ))}
            </div>
          </section>
          </Reveal>
        )}

        <Reveal delay={0.12}>
        <section id="products" className="space-y-4">
            <div className="flex flex-col gap-3 sm:flex-row sm:items-end sm:justify-between">
              <div>
                <h2 className="text-base font-medium text-white">
                  Your products
                </h2>
                <p className="mt-1 text-sm text-gray-500">
                  Search and filter by active cover, ending soon, or ended
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
            <ProductSearch
              initialProducts={products}
              initialNextCursor={productsNextCursor}
              initialHasMore={productsHasMore}
              totalProducts={counts.totalProducts}
            />
          </section>
        </Reveal>
          </>
        )}
      </div>
  );
}
