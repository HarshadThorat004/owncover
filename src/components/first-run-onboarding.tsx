import Link from "next/link";
import { CalendarDays, FileDown, Inbox, Plus, ScanLine } from "lucide-react";

import CopyInboundAddressButton from "@/components/copy-inbound-address-button";
import LoadSampleProductButton from "@/components/load-sample-product-button";
import { BRAND_INBOUND_DOMAIN } from "@/constants/brand";
import { SAMPLE_PRODUCT_SERIAL } from "@/constants/sample-claim-pack";
import { DASHBOARD_STRINGS } from "@/lib/dashboard-i18n";
import type { Locale } from "@/lib/locale";

type Props = {
  inboundAddress?: string | null;
  shared?: boolean;
  locale?: Locale;
};

export default function FirstRunOnboarding({
  inboundAddress,
  shared = false,
  locale = "en",
}: Props) {
  const t = DASHBOARD_STRINGS[locale].onboarding;

  return (
    <section lang={locale} className="space-y-4">
      <div className="rounded-2xl border border-dashed border-white/10 bg-neutral-950/50 p-6 md:p-8">
        <p className="text-[11px] uppercase tracking-[0.16em] text-cyan-300/80">
          {t.eyebrow}
        </p>
        <h2 className="mt-3 text-2xl font-semibold tracking-tight text-white">
          {t.title}
        </h2>
        <p className="mt-2 max-w-xl text-sm leading-7 text-gray-500">
          {t.intro}
          {shared && t.shared}
        </p>

        <ol className="mt-8 grid gap-4 md:grid-cols-3">
          <li className="rounded-2xl border border-white/10 bg-black/30 p-5">
            <p className="font-display text-sm text-white/30">01</p>
            <div className="mt-3 flex items-center gap-2 text-cyan-300">
              <ScanLine size={16} />
              <h3 className="text-sm font-medium text-white">{t.scanTitle}</h3>
            </div>
            <p className="mt-2 text-sm leading-6 text-gray-500">{t.scanBody}</p>
          </li>
          <li className="rounded-2xl border border-white/10 bg-black/30 p-5">
            <p className="font-display text-sm text-white/30">02</p>
            <div className="mt-3 flex items-center gap-2 text-cyan-300">
              <FileDown size={16} />
              <h3 className="text-sm font-medium text-white">{t.packTitle}</h3>
            </div>
            <p className="mt-2 text-sm leading-6 text-gray-500">{t.packBody}</p>
          </li>
          <li className="rounded-2xl border border-white/10 bg-black/30 p-5">
            <p className="font-display text-sm text-white/30">03</p>
            <div className="mt-3 flex items-center gap-2 text-cyan-300">
              <CalendarDays size={16} />
              <h3 className="text-sm font-medium text-white">
                {t.remindersTitle}
              </h3>
            </div>
            <p className="mt-2 text-sm leading-6 text-gray-500">
              {t.remindersBody}
            </p>
          </li>
        </ol>

        <div className="mt-8 flex flex-col gap-3 sm:flex-row sm:flex-wrap">
          <Link
            href="/dashboard/add-product?focus=scan"
            className="premium-btn premium-btn-solid inline-flex items-center justify-center gap-2 rounded-xl bg-white px-5 py-3 text-sm font-semibold text-black"
          >
            <ScanLine size={16} />
            {t.scanTitle}
          </Link>
          <a
            href="#forward-invoice"
            className="premium-ghost inline-flex items-center justify-center gap-2 rounded-xl border border-white/10 px-5 py-3 text-sm font-medium text-gray-200"
          >
            <Inbox size={16} />
            {t.forwardCta}
          </a>
          <LoadSampleProductButton />
        </div>
        <div className="mt-3">
          <Link
            href="/dashboard/add-product"
            className="inline-flex items-center gap-1.5 text-sm text-gray-500 underline-offset-2 hover:text-gray-300 hover:underline"
          >
            <Plus size={14} />
            {t.manualCta}
          </Link>
        </div>
        <p className="mt-4 text-xs leading-6 text-gray-600">
          {t.sampleNote(SAMPLE_PRODUCT_SERIAL)}
        </p>
      </div>

      <div
        id="forward-invoice"
        className="flex scroll-mt-24 items-start gap-3 rounded-2xl border border-white/10 bg-neutral-950/80 p-5"
      >
        <Inbox size={16} className="mt-0.5 shrink-0 text-cyan-300" />
        <div>
          <p className="text-sm font-medium text-white">{t.forwardTitle}</p>
          <p className="mt-1 text-sm leading-6 text-gray-500">
            {t.forwardBody(BRAND_INBOUND_DOMAIN)}
          </p>
          <CopyInboundAddressButton address={inboundAddress} />
        </div>
      </div>
    </section>
  );
}
