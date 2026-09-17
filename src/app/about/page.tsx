import type { Metadata } from "next";
import Link from "next/link";
import { ArrowRight } from "lucide-react";

import MarketingPage from "@/components/marketing-page";
import {
  BRAND_CONTACT_EMAIL,
  BRAND_FOUNDER,
  BRAND_NAME,
} from "@/constants/brand";

export const metadata: Metadata = {
  title: "About",
  description: `Who built ${BRAND_NAME}, who it is for, and what it will never become.`,
};

const NEVER = [
  {
    title: "File claims",
    body: "We do not call the service centre, argue with the brand, or act as your claims agent.",
  },
  {
    title: "Sell your bills",
    body: "GST invoices stay in your vault. We do not sell personal data or train public models on your documents.",
  },
  {
    title: "Pretend to be the desk",
    body: "OwnCover is not a manufacturer, retailer, insurer, or law firm. The desk still runs the claim. We get you ready for it.",
  },
];

export default function AboutPage() {
  return (
    <MarketingPage
      eyebrow="About"
      title="Built for the morning you actually go to the desk."
      lede={`${BRAND_NAME} is an India-first warranty vault. GST invoices go missing at home, in shops, gyms, and offices. Desks want a printed tax invoice, serial, and dates. We store the vault and print the pack.`}
    >
      <div className="space-y-12">
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
                Founder of {BRAND_NAME}. The product is for anyone in India who
                uses brand and retailer service desks — a house, a shop, a gym,
                an office — not for a US-style “warranty manager” that ignores
                GST, store cover, and the printed invoice the counter will ask
                for.
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

        <section>
          <h2 className="font-display text-2xl md:text-3xl">
            What we will never do
          </h2>
          <div className="mt-6 grid gap-4 sm:grid-cols-3">
            {NEVER.map((item) => (
              <div
                key={item.title}
                className="rounded-2xl border border-white/10 p-5"
              >
                <h3 className="text-sm font-medium text-white">{item.title}</h3>
                <p className="mt-2 text-sm leading-7 text-gray-500">
                  {item.body}
                </p>
              </div>
            ))}
          </div>
        </section>

        <section className="space-y-4 text-sm leading-7 text-gray-400">
          <h2 className="font-display text-2xl text-white md:text-3xl">
            Why the product looks like this
          </h2>
          <p>
            Manufacturer cover and store or AMC cover are different dates. A
            folder treats them as one. The desk does not. GST QR codes already
            hold invoice facts — we read those first, then OCR, then you
            confirm. Unsure fields stay empty.
          </p>
          <p>
            Hindi labels on boxes and bills are normal. On-device scan looks at
            English and Hindi. Homes, shops, gyms, and offices share equipment —
            so the vault can be shared, with each person still on their own
            sign-in.
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
