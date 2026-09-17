import type { Metadata } from "next";
import Link from "next/link";
import { ArrowRight } from "lucide-react";

import FaqList from "@/components/faq-list";
import HelpLangSwitch from "@/components/help-lang-switch";
import MarketingPage from "@/components/marketing-page";
import { BRAND_INBOUND_DOMAIN, BRAND_NAME } from "@/constants/brand";
import { FAQS } from "@/constants/faqs";
import { HELP_EXPLAINERS, HELP_GUIDES } from "@/constants/help-guides";

export const metadata: Metadata = {
  title: "Help",
  description: `GST scan, claim pack printing, and desk checklists for TV, fridge, phone, and AC. ${BRAND_NAME} does not file claims.`,
  alternates: {
    languages: {
      en: "/help",
      hi: "/help/hi",
    },
  },
};

export default function HelpPage() {
  return (
    <MarketingPage
      wide
      eyebrow="Help"
      title="What the desk will ask. What we will not do."
      lede={`${BRAND_NAME} is a vault and a pack. We do not file claims, call the brand, or staff the service centre. These guides are for the morning you actually go.`}
    >
      <div className="space-y-16">
        <HelpLangSwitch locale="en" />

        <section>
          <h2 className="font-display text-2xl md:text-3xl">Desk guides</h2>
          <p className="mt-3 max-w-2xl text-sm leading-7 text-gray-500">
            Checklists already live in the claim pack. They are published here
            so you can read them before you sign up.
          </p>
          <div className="mt-6 grid gap-4 sm:grid-cols-2">
            {HELP_GUIDES.map((guide) => (
              <Link
                key={guide.slug}
                href={`/help/${guide.slug}`}
                className="group rounded-2xl border border-white/10 p-5 transition hover:border-white/20"
              >
                <p className="text-[11px] uppercase tracking-[0.16em] text-cyan-300/80">
                  {guide.navLabel}
                </p>
                <h3 className="mt-2 text-base font-medium text-white">
                  {guide.title}
                </h3>
                <p className="mt-2 text-sm leading-6 text-gray-500">
                  {guide.lede}
                </p>
                <span className="mt-4 inline-flex items-center gap-1 text-sm text-cyan-300/90 group-hover:gap-2">
                  Open guide
                  <ArrowRight size={14} />
                </span>
              </Link>
            ))}
          </div>
        </section>

        <section>
          <h2 className="font-display text-2xl md:text-3xl">Scan, pack, desks</h2>
          <div className="mt-6 grid gap-4 md:grid-cols-2">
            {HELP_EXPLAINERS.map((item) => (
              <article
                key={item.id}
                id={item.id}
                className="rounded-2xl border border-white/10 p-5 md:p-6"
              >
                <h3 className="text-base font-medium text-white">
                  {item.title}
                </h3>
                <p className="mt-2 text-sm leading-7 text-gray-500">
                  {item.body}
                </p>
              </article>
            ))}
          </div>
          <p className="mt-6 text-sm leading-7 text-gray-500">
            Amazon or Flipkart PDF still in mail? After you sign in, forward it
            to your private address on {BRAND_INBOUND_DOMAIN}. We start a draft.
            You confirm dates.
          </p>
        </section>

        <section id="faq">
          <h2 className="font-display text-2xl md:text-3xl">
            Straight answers
          </h2>
          <p className="mt-3 text-sm leading-7 text-gray-500">
            The same questions as the homepage, plus the objections a desk
            visit actually raises.
          </p>
          <div className="mt-8">
            <FaqList items={FAQS} />
          </div>
        </section>

        <div className="flex flex-wrap gap-3">
          <Link
            href="/sample-pack"
            className="premium-btn premium-btn-solid inline-flex items-center gap-2 rounded-xl bg-white px-5 py-3 text-sm font-semibold text-black"
          >
            See a sample pack
            <ArrowRight size={16} />
          </Link>
          <Link
            href="/contact"
            className="premium-ghost rounded-xl border border-white/10 px-5 py-3 text-sm font-medium text-gray-300"
          >
            Write to us
          </Link>
        </div>
      </div>
    </MarketingPage>
  );
}
