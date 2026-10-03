import type { Metadata } from "next";
import Link from "next/link";
import { ArrowRight, FileText } from "lucide-react";

import MarketingShell from "@/components/marketing-shell";
import Reveal from "@/components/reveal";
import VaultStage from "@/components/vault-stage";

export const metadata: Metadata = {
  title: "Sample claim pack",
  description:
    "Open a fictional OwnCover claim pack — invoice facts, serial, cover dates, and a checklist. No account required.",
};

const INSIDE = [
  {
    title: "Invoice facts",
    body: "GST invoice number, retailer, purchase date, and amount from the bill you saved.",
  },
  {
    title: "Serial and model",
    body: "So the unit matches the paper, not a screenshot from chat.",
  },
  {
    title: "Brand vs store cover",
    body: "Two dates, labelled. You know which cover still runs.",
  },
  {
    title: "Checklist",
    body: "Printed tax invoice, warranty card, and this pack. Keep the original invoice with you.",
  },
];

export default function SamplePackPage() {
  return (
    <MarketingShell>
      <section className="relative mx-auto max-w-3xl px-5 py-20 text-center md:px-8 md:py-28">
        <p className="text-[11px] uppercase tracking-[0.16em] text-cyan-300/80">
          Sample — not a real claim
        </p>
        <h1 className="hero-enter font-display mx-auto mt-4 max-w-2xl text-4xl leading-[1.1] md:text-6xl">
          This is what a claim pack looks like.
        </h1>
        <p className="mx-auto mt-6 max-w-xl text-base leading-8 text-gray-400">
          A fictional 43-inch TV with invoice facts, serial, brand and store
          cover, and a short checklist. Your own products get the same layout
          after you add them.
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
          Serial SAMPLE-TV-0000. No login required.
        </p>
      </section>

      <section className="relative mx-auto max-w-5xl px-5 pb-16 md:px-8">
        <VaultStage />
      </section>

      <section className="relative mx-auto max-w-5xl px-5 pb-24 md:px-8">
        <div className="grid gap-4 sm:grid-cols-2">
          {INSIDE.map((item, index) => (
            <Reveal key={item.title} delay={index * 0.08}>
              <div className="premium-card rounded-2xl border border-white/10 p-6 text-left">
                <h2 className="text-base font-medium text-white">{item.title}</h2>
                <p className="mt-2 text-sm leading-7 text-gray-500">{item.body}</p>
              </div>
            </Reveal>
          ))}
        </div>
      </section>
    </MarketingShell>
  );
}
