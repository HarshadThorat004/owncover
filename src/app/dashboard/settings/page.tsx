import Link from "next/link";
import { notFound } from "next/navigation";
import { CalendarDays, Download, FileJson, Shield, Bell, Languages } from "lucide-react";

import Breadcrumbs from "@/components/breadcrumbs";
import DashboardShell from "@/components/dashboard-shell";
import DeleteAccountButton from "@/components/delete-account-button";
import HouseholdSettings from "@/components/household-settings";
import InboundSettings from "@/components/inbound-settings";
import LanguageSettings from "@/components/language-settings";
import PushToggle from "@/components/push-toggle";
import { getHouseholdIdForUser, vaultProductWhere } from "@/lib/household";
import { parseLocale } from "@/lib/locale";
import { getSessionUser } from "@/lib/product-access";
import { prisma } from "@/lib/prisma";

export default async function SettingsPage() {
  const user = await getSessionUser();

  if (!user) {
    return notFound();
  }

  const householdId = await getHouseholdIdForUser(user.id);
  const membership = householdId
    ? await prisma.householdMember.findUnique({
        where: { userId: user.id },
        select: { role: true, household: { select: { members: { select: { id: true } } } } },
      })
    : null;
  const sharedMemberCount = membership?.household.members.length ?? 0;
  const deleteMode =
    !membership
      ? "solo"
      : membership.role !== "owner"
        ? "member"
        : sharedMemberCount > 1
          ? "owner-with-others"
          : "solo";

  const [productCount, account] = await Promise.all([
    prisma.product.count({
      where: vaultProductWhere(user.id, householdId),
    }),
    prisma.user.findUnique({ where: { id: user.id }, select: { locale: true } }),
  ]);

  return (
    <DashboardShell className="max-w-3xl">
      <div className="flex flex-col gap-6">
        <Breadcrumbs
          items={[
            { label: "Dashboard", href: "/dashboard" },
            { label: "Settings" },
          ]}
        />

        <section className="premium-card rounded-2xl border border-white/10 bg-neutral-950/80 p-6 md:p-8">
          <p className="text-xs font-medium uppercase tracking-[0.18em] text-cyan-300/80">
            Account
          </p>
          <h1 className="mt-3 text-2xl font-semibold tracking-tight text-white md:text-3xl">
            Settings
          </h1>
          <p className="mt-2 text-sm leading-7 text-gray-500">
            Household sharing, reminders, exports, and how to delete the account.
          </p>

          <dl className="mt-8 grid gap-4 sm:grid-cols-2">
            <div className="rounded-xl border border-white/5 bg-black/30 p-4">
              <dt className="text-xs text-gray-500">Signed in as</dt>
              <dd className="mt-1 truncate text-sm font-medium text-white">
                {user.email}
              </dd>
            </div>
            <div className="rounded-xl border border-white/5 bg-black/30 p-4">
              <dt className="text-xs text-gray-500">Products in vault</dt>
              <dd className="mt-1 text-sm font-medium text-white">
                {productCount}
              </dd>
            </div>
          </dl>
        </section>

        <HouseholdSettings currentUserId={user.id} />

        <InboundSettings />

        <section className="premium-card rounded-2xl border border-white/10 bg-neutral-950/80 p-6 md:p-8">
          <div className="flex items-start gap-3">
            <Shield size={18} className="mt-0.5 text-cyan-300" />
            <div>
              <h2 className="text-base font-semibold text-white">
                How we use your documents
              </h2>
              <p className="mt-2 text-sm leading-7 text-gray-500">
                Invoice and warranty scans are used only to fill your product
                form. Camera scans run in your browser when possible. PDFs are
                read on the server. We do not sell this data or use it to train
                public models.
              </p>
              <p className="mt-3 text-sm leading-7 text-gray-500">
                Files stay in your vault until you delete the product or this
                account. GSTIN, address, and phone printed on an invoice live
                inside the file you uploaded — we do not store GSTIN as a
                separate field.
              </p>
              <p className="mt-4 text-sm">
                <Link
                  href="/security"
                  className="text-cyan-300/90 underline-offset-2 hover:underline"
                >
                  Security
                </Link>
                <span className="mx-2 text-gray-700">·</span>
                <Link
                  href="/privacy"
                  className="text-cyan-300/90 underline-offset-2 hover:underline"
                >
                  Privacy policy
                </Link>
              </p>
            </div>
          </div>
        </section>

        <section className="premium-card rounded-2xl border border-white/10 bg-neutral-950/80 p-6 md:p-8">
          <div className="flex items-start gap-3">
            <Bell size={18} className="mt-0.5 text-cyan-300" />
            <div className="min-w-0 flex-1">
              <h2 className="text-base font-semibold text-white">
                Email and browser alerts
              </h2>
              <p className="mt-2 text-sm leading-7 text-gray-500">
                Email at 30 days, 7 days, and the day before cover ends. Mondays
                we also send a vault digest when something needs you — expiry
                inside 30 days, a missing serial, or a forwarded invoice still
                in draft. Quiet weeks stay quiet.
              </p>
              <p className="mt-3 text-sm leading-7 text-gray-500">
                Browser alerts are optional. Turn them off anytime. We only
                store a push endpoint for this device.
              </p>
              <div className="mt-5">
                <PushToggle />
              </div>
            </div>
          </div>
        </section>

        <section className="premium-card rounded-2xl border border-white/10 bg-neutral-950/80 p-6 md:p-8">
          <div className="flex items-start gap-3">
            <Languages size={18} className="mt-0.5 text-cyan-300" />
            <div className="min-w-0 flex-1">
              <h2 className="text-base font-semibold text-white">Language</h2>
              <p className="mt-2 text-sm leading-7 text-gray-500">
                Reminder emails, the Monday digest, browser alerts, and the
                getting-started screen follow this choice.
              </p>
              <div className="mt-5">
                <LanguageSettings initialLocale={parseLocale(account?.locale)} />
              </div>
            </div>
          </div>
        </section>

        <section className="premium-card rounded-2xl border border-white/10 bg-neutral-950/80 p-6 md:p-8">
          <h2 className="text-base font-semibold text-white">Your data</h2>
          <p className="mt-2 text-sm leading-7 text-gray-500">
            Download a spreadsheet of every product, or add expiry dates to your
            calendar. Claim packs live on each product page.
          </p>
          <div className="mt-5 flex flex-wrap gap-2">
            <a
              href="/api/exports?format=csv"
              className="premium-ghost inline-flex items-center gap-2 rounded-xl border border-white/10 px-3 py-2 text-sm font-medium text-gray-300"
            >
              <Download size={14} />
              CSV export
            </a>
            <a
              href="/api/exports?format=ics"
              className="premium-ghost inline-flex items-center gap-2 rounded-xl border border-white/10 px-3 py-2 text-sm font-medium text-gray-300"
            >
              <CalendarDays size={14} />
              Calendar
            </a>
            <a
              href="/api/exports?format=json"
              className="premium-ghost inline-flex items-center gap-2 rounded-xl border border-white/10 px-3 py-2 text-sm font-medium text-gray-300"
            >
              <FileJson size={14} />
              Full data (JSON)
            </a>
          </div>
        </section>

        <section className="rounded-2xl border border-red-500/20 bg-red-500/[0.06] p-6 md:p-8">
          <h2 className="text-base font-semibold text-white">Danger zone</h2>
          <p className="mt-2 text-sm leading-7 text-gray-400">
            {deleteMode === "member"
              ? "Delete this account. You will leave the shared vault. Products stay with the vault."
              : deleteMode === "owner-with-others"
                ? "Delete this account. Ownership of the shared vault moves to another member. Products stay."
                : "Delete this account and every product, document, and reminder tied to it. You will be signed out immediately."}
          </p>
          <div className="mt-5">
            <DeleteAccountButton email={user.email} mode={deleteMode} />
          </div>
        </section>
      </div>
    </DashboardShell>
  );
}
