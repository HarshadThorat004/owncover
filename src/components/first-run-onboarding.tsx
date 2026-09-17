import Link from "next/link";
import { CalendarDays, FileDown, Inbox, Plus, ScanLine } from "lucide-react";

import LoadSampleProductButton from "@/components/load-sample-product-button";
import { BRAND_INBOUND_DOMAIN } from "@/constants/brand";
import { SAMPLE_PRODUCT_SERIAL } from "@/constants/sample-claim-pack";

export default function FirstRunOnboarding() {
  return (
    <section className="space-y-4">
      <div className="rounded-2xl border border-dashed border-white/10 bg-neutral-950/50 p-6 md:p-8">
        <p className="text-[11px] uppercase tracking-[0.16em] text-cyan-300/80">
          First 10 minutes
        </p>
        <h2 className="mt-3 text-2xl font-semibold tracking-tight text-white">
          Scan once. Walk in prepared.
        </h2>
        <p className="mt-2 max-w-xl text-sm leading-7 text-gray-500">
          Three steps. You confirm the dates. We do not file claims.
        </p>

        <ol className="mt-8 grid gap-4 md:grid-cols-3">
          <li className="rounded-2xl border border-white/10 bg-black/30 p-5">
            <p className="font-display text-sm text-white/30">01</p>
            <div className="mt-3 flex items-center gap-2 text-cyan-300">
              <ScanLine size={16} />
              <h3 className="text-sm font-medium text-white">Scan a GST bill</h3>
            </div>
            <p className="mt-2 text-sm leading-6 text-gray-500">
              Photo or PDF. QR first, then on-device OCR. Empty is better than a
              wrong expiry.
            </p>
          </li>
          <li className="rounded-2xl border border-white/10 bg-black/30 p-5">
            <p className="font-display text-sm text-white/30">02</p>
            <div className="mt-3 flex items-center gap-2 text-cyan-300">
              <FileDown size={16} />
              <h3 className="text-sm font-medium text-white">Download a pack</h3>
            </div>
            <p className="mt-2 text-sm leading-6 text-gray-500">
              Invoice facts, serial, and a desk checklist in one PDF. Print it.
              Keep originals.
            </p>
          </li>
          <li className="rounded-2xl border border-white/10 bg-black/30 p-5">
            <p className="font-display text-sm text-white/30">03</p>
            <div className="mt-3 flex items-center gap-2 text-cyan-300">
              <CalendarDays size={16} />
              <h3 className="text-sm font-medium text-white">
                Add expiry to calendar
              </h3>
            </div>
            <p className="mt-2 text-sm leading-6 text-gray-500">
              Email and browser at 30 / 7 / 1 days. Download .ics for Google or
              Apple Calendar.
            </p>
          </li>
        </ol>

        <div className="mt-8 flex flex-col gap-3 sm:flex-row sm:flex-wrap">
          <Link
            href="/dashboard/add-product"
            className="premium-btn premium-btn-solid inline-flex items-center justify-center gap-2 rounded-xl bg-white px-5 py-3 text-sm font-semibold text-black"
          >
            <Plus size={16} />
            Add first product
          </Link>
          <LoadSampleProductButton />
        </div>
        <p className="mt-4 text-xs leading-6 text-gray-600">
          Sample TV is fictional (serial {SAMPLE_PRODUCT_SERIAL}). Same pack layout
          as yours. Delete it after you try the download.
        </p>
      </div>

      <div className="flex items-start gap-3 rounded-2xl border border-white/10 bg-neutral-950/80 p-5">
        <Inbox size={16} className="mt-0.5 shrink-0 text-cyan-300" />
        <div>
          <p className="text-sm font-medium text-white">
            Amazon or Flipkart PDF in your inbox?
          </p>
          <p className="mt-1 text-sm leading-6 text-gray-500">
            Forward it to your private address on {BRAND_INBOUND_DOMAIN}. We
            start a draft. You confirm dates before it is saved.
          </p>
          <Link
            href="/dashboard/settings"
            className="mt-2 inline-block text-sm text-cyan-300/90 underline-offset-2 hover:underline"
          >
            Copy inbound address
          </Link>
        </div>
      </div>
    </section>
  );
}
