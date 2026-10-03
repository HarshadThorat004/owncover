import type { Metadata } from "next";
import Link from "next/link";
import { ArrowRight } from "lucide-react";

import FaqList from "@/components/faq-list";
import HelpLangSwitch from "@/components/help-lang-switch";
import MarketingPage from "@/components/marketing-page";
import Reveal from "@/components/reveal";
import { BRAND_NAME } from "@/constants/brand";
import {
  FAQS_HI,
  HELP_GUIDES_HI,
  HELP_HI_EXPLAINERS,
  HELP_HI_HUB,
} from "@/constants/help-hi";

export const metadata: Metadata = {
  title: "मदद",
  description: `GST स्कैन, क्लेम पैक, और टीवी, फ्रिज, फ़ोन, AC के लिए गाइड। ${BRAND_NAME}.`,
  alternates: {
    languages: {
      en: "/help",
      hi: "/help/hi",
    },
  },
};

export default function HindiHelpPage() {
  const copy = HELP_HI_HUB;

  return (
    <MarketingPage
      wide
      lang="hi"
      eyebrow={copy.eyebrow}
      title={copy.title}
      lede={copy.lede}
    >
      <div className="space-y-16">
        <HelpLangSwitch locale="hi" />

        <section>
          <h2 className="font-display text-2xl md:text-3xl">
            {copy.guidesHeading}
          </h2>
          <p className="mt-3 max-w-2xl text-sm leading-7 text-gray-500">
            {copy.guidesLede}
          </p>
          <div className="mt-6 grid gap-4 sm:grid-cols-2">
            {HELP_GUIDES_HI.map((guide, index) => (
              <Reveal key={guide.slug} delay={index * 0.06}>
              <Link
                href={`/help/hi/${guide.slug}`}
                className="premium-card group flex h-full flex-col rounded-2xl border border-white/10 p-5 transition hover:border-white/20"
              >
                <p className="text-[11px] uppercase tracking-[0.16em] text-cyan-300/80">
                  {guide.navLabel}
                </p>
                <h3 className="mt-2 text-base font-medium text-white">
                  {guide.title}
                </h3>
                <p className="mt-2 flex-1 text-sm leading-6 text-gray-500">
                  {guide.lede}
                </p>
                <span className="mt-4 inline-flex items-center gap-1 text-sm text-cyan-300/90 group-hover:gap-2">
                  {copy.openGuide}
                  <ArrowRight size={14} />
                </span>
              </Link>
              </Reveal>
            ))}
          </div>
        </section>

        <section>
          <h2 className="font-display text-2xl md:text-3xl">
            {copy.explainersHeading}
          </h2>
          <div className="mt-6 grid gap-4 md:grid-cols-2">
            {HELP_HI_EXPLAINERS.map((item, index) => (
              <Reveal key={item.id} delay={index * 0.05}>
              <article
                id={item.id}
                className="premium-card h-full rounded-2xl border border-white/10 p-5 md:p-6"
              >
                <h3 className="text-base font-medium text-white">
                  {item.title}
                </h3>
                <p className="mt-2 text-sm leading-7 text-gray-500">
                  {item.body}
                </p>
              </article>
              </Reveal>
            ))}
          </div>
          <p className="mt-6 text-sm leading-7 text-gray-500">{copy.inbound}</p>
        </section>

        <section id="faq">
          <h2 className="font-display text-2xl md:text-3xl">
            {copy.faqHeading}
          </h2>
          <p className="mt-3 text-sm leading-7 text-gray-500">{copy.faqLede}</p>
          <div className="mt-8">
            <FaqList items={FAQS_HI} />
          </div>
        </section>

        <div className="flex flex-wrap gap-3">
          <Link
            href="/sample-pack"
            className="premium-btn premium-btn-solid inline-flex items-center gap-2 rounded-xl bg-white px-5 py-3 text-sm font-semibold text-black"
          >
            {copy.sampleCta}
            <ArrowRight size={16} />
          </Link>
          <Link
            href="/contact"
            className="premium-ghost rounded-xl border border-white/10 px-5 py-3 text-sm font-medium text-gray-300"
          >
            {copy.contactCta}
          </Link>
        </div>
      </div>
    </MarketingPage>
  );
}
