import type { Metadata } from "next";
import Link from "next/link";
import { ArrowRight } from "lucide-react";

import MarketingPage from "@/components/marketing-page";
import Reveal from "@/components/reveal";
import {
  BRAND_CONTACT_EMAIL,
  BRAND_FOUNDER,
  BRAND_NAME,
} from "@/constants/brand";

export const metadata: Metadata = {
  title: "About",
  description: `Who built ${BRAND_NAME} and what the product is for.`,
};

const NEVER = [
  {
    title: "File claims for you",
    body: "OwnCover does not call brands or retailers on your behalf. It keeps your records organised.",
  },
  {
    title: "Sell your bills",
    body: "GST invoices stay in your vault. We do not sell personal data or train public models on your documents.",
  },
  {
    title: "Replace the manufacturer",
    body: "We are not a brand, retailer, insurer, or law firm. We store dates and documents you already have.",
  },
];

export default function AboutPage() {
  return (
    <MarketingPage
      eyebrow="About"
      title="Warranty records for Indian homes."
      lede={`${BRAND_NAME} is a vault for GST invoices, serial numbers, and cover dates — with reminders before anything expires and a claim pack when you need it.`}
    >
      <div className="space-y-12">
        <Reveal>
          <section className="rounded-2xl border border-white/10 p-6 md:p-8">
            <p className="text-[11px] uppercase tracking-[0.16em] text-gray-500">
              Who builds this
            </p>
            <div className="mt-4 flex items-start gap-4">
              <div
                className="flex h-14 w-14 shrink-0 items-center justify-center rounded-2xl border border-white/10 text-sm font-medium tracking-wide text-white"
                aria-hidden
              >
                HT
              </div>
              <div>
                <h2 className="text-lg font-medium text-white">{BRAND_FOUNDER}</h2>
                <p className="mt-2 text-sm leading-7 text-gray-400">
                  Founder of {BRAND_NAME}. The product is built for how India
                  buys — GST invoices, separate brand and store cover, and
                  reminders before a warranty ends.
                </p>
                <p className="mt-3 text-sm leading-7 text-gray-500">
                  Questions:{" "}
                  <a
                    href={`mailto:${BRAND_CONTACT_EMAIL}`}
                    className="text-cyan-300/90 underline-offset-2 hover:underline"
                  >
                    {BRAND_CONTACT_EMAIL}
                  </a>
                </p>
              </div>
            </div>
          </section>
        </Reveal>

        <section>
          <h2 className="font-display text-2xl md:text-3xl">
            What we will never do
          </h2>
          <div className="mt-6 grid gap-4 sm:grid-cols-3">
            {NEVER.map((item, index) => (
              <Reveal key={item.title} delay={index * 0.08}>
                <div className="premium-card h-full rounded-2xl border border-white/10 p-5">
                  <h3 className="text-sm font-medium text-white">{item.title}</h3>
                  <p className="mt-2 text-sm leading-7 text-gray-500">
                    {item.body}
                  </p>
                </div>
              </Reveal>
            ))}
          </div>
        </section>

        <section className="space-y-4 text-sm leading-7 text-gray-400">
          <h2 className="font-display text-2xl text-white md:text-3xl">
            Why the product looks like this
          </h2>
          <p>
            Brand warranty and store or AMC cover are different dates. GST QR
            codes already hold invoice facts — we read those first, then OCR,
            then you confirm. Unsure fields stay empty.
          </p>
          <p>
            Hindi labels on boxes and bills are normal. On-device scan looks at
            English and Hindi. Families can share one vault, with each person on
            their own sign-in.
          </p>
        </section>

        <div className="flex flex-wrap gap-3">
          <Link
            href="/register"
            className="premium-btn premium-btn-solid inline-flex items-center gap-2 rounded-xl bg-white px-5 py-3 text-sm font-semibold text-black"
          >
            Create free account
            <ArrowRight size={16} />
          </Link>
          <Link
            href="/security"
            className="premium-ghost rounded-xl border border-white/10 px-5 py-3 text-sm font-medium text-gray-300"
          >
            How we handle documents
          </Link>
        </div>
      </div>
    </MarketingPage>
  );
}
