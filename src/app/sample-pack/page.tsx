import type { Metadata } from "next";
import Link from "next/link";
import { ArrowRight, FileText } from "lucide-react";

import HeroArtifact from "@/components/hero-artifact";
import MarketingShell from "@/components/marketing-shell";

export const metadata: Metadata = {
  title: "Sample claim pack",
  description:
    "Open a fictional OwnCover claim pack — invoice facts, serial, cover dates, and a desk checklist. No account required.",
};

const INSIDE = [
  {
    title: "Invoice facts",
    body: "GST invoice number, retailer, purchase date, and amount — the fields a desk usually asks for first.",
  },
  {
    title: "Serial and model",
    body: "So the unit on the counter matches the paper, not a WhatsApp screenshot of the box.",
  },
  {
    title: "Manufacturer vs store cover",
    body: "Two dates, labelled. You know which cover still runs before you go to the desk.",
  },
  {
    title: "Desk checklist",
    body: "Printed tax invoice, warranty card, this pack. Do not leave originals behind.",
  },
];

export default function SamplePackPage() {
  return (
    <MarketingShell>
      <section className="relative mx-auto max-w-3xl px-5 py-20 text-center md:px-8 md:py-28">
        <p className="text-[11px] uppercase tracking-[0.16em] text-cyan-300/80">
          Sample — not a real claim
        </p>
        <h1 className="font-display mx-auto mt-4 max-w-2xl text-4xl leading-[1.1] md:text-6xl">
          This is what you take to the desk.
        </h1>
        <p className="mx-auto mt-6 max-w-xl text-base leading-8 text-gray-400">
          A fictional 43-inch TV with invoice facts, serial, manufacturer and
          store cover, and a desk checklist. Your own products get the same
          layout after you add them. OwnCover does not file claims.
        </p>

        <div className="mt-10 flex flex-wrap items-center justify-center gap-3">
          <a
            href="/api/sample-pack"
            className="premium-btn premium-btn-solid inline-flex items-center gap-2 rounded-xl bg-white px-5 py-3.5 text-sm font-semibold text-black"
          >
            <FileText size={16} />
            Open sample PDF
          </a>
          <Link
            href="/register"
            className="premium-ghost inline-flex items-center gap-2 rounded-xl border border-white/10 px-5 py-3.5 text-sm font-medium text-gray-300"
          >
            Create free account
            <ArrowRight size={16} />
          </Link>
        </div>
        <p className="mt-4 text-sm text-gray-600">
          Serial SAMPLE-TV-0000. No login. We do not file claims.
        </p>
      </section>

      <section className="relative mx-auto max-w-5xl px-5 pb-16 md:px-8">
        <HeroArtifact caption={false} showPdfCta={false} />
      </section>

      <section className="relative mx-auto max-w-5xl px-5 pb-24 md:px-8">
        <div className="grid gap-4 sm:grid-cols-2">
          {INSIDE.map((item) => (
            <div
              key={item.title}
              className="rounded-2xl border border-white/10 p-6 text-left"
            >
              <h2 className="text-base font-medium text-white">{item.title}</h2>
              <p className="mt-2 text-sm leading-7 text-gray-500">{item.body}</p>
            </div>
          ))}
        </div>
      </section>
    </MarketingShell>
  );
}
