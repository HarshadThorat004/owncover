import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { ArrowRight } from "lucide-react";

import HelpLangSwitch from "@/components/help-lang-switch";
import MarketingPage from "@/components/marketing-page";
import { BRAND_NAME } from "@/constants/brand";
import { categoryLabel } from "@/constants/catalog";
import {
  getHelpGuideHi,
  HELP_GUIDES_HI,
  HELP_HI_HUB,
} from "@/constants/help-hi";

type Props = {
  params: Promise<{ slug: string }>;
};

export function generateStaticParams() {
  return HELP_GUIDES_HI.map((guide) => ({ slug: guide.slug }));
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params;
  const guide = getHelpGuideHi(slug);

  if (!guide) {
    return { title: HELP_HI_HUB.eyebrow };
  }

  return {
    title: `${guide.title} — मदद`,
    description: `${guide.lede} ${BRAND_NAME}.`,
    alternates: {
      languages: {
        en: `/help/${slug}`,
        hi: `/help/hi/${slug}`,
      },
    },
  };
}

export default async function HindiHelpGuidePage({ params }: Props) {
  const { slug } = await params;
  const guide = getHelpGuideHi(slug);

  if (!guide) {
    notFound();
  }

  const copy = HELP_HI_HUB;

  return (
    <MarketingPage
      lang="hi"
      eyebrow={copy.eyebrow}
      title={guide.title}
      lede={guide.lede}
    >
      <div className="space-y-10">
        <HelpLangSwitch locale="hi" slug={guide.slug} />

        <p className="text-sm text-gray-500">
          {copy.categoryPrefix}: {categoryLabel(guide.category)}. {copy.noClaim}
        </p>

        <section className="premium-card rounded-2xl border border-white/10 p-5 md:p-6">
          <h2 className="text-sm font-medium text-white">
            {guide.checklistTitle}
          </h2>
          <ul className="mt-4 space-y-2.5">
            {guide.checklistItems.map((item) => (
              <li
                key={item}
                className="flex gap-3 text-sm leading-6 text-gray-300"
              >
                <span className="mt-0.5 h-4 w-4 shrink-0 rounded border border-white/20" />
                {item}
              </li>
            ))}
          </ul>
        </section>

        <section>
          <h2 className="text-base font-medium text-white">
            {copy.beforeLeave}
          </h2>
          <ul className="mt-4 space-y-3">
            {guide.notes.map((note) => (
              <li key={note} className="text-sm leading-7 text-gray-400">
                {note}
              </li>
            ))}
          </ul>
        </section>

        <p className="text-sm leading-7 text-gray-500">{copy.afterChecklist}</p>

        <div className="flex flex-wrap gap-3">
          <Link
            href="/register"
            className="premium-btn premium-btn-solid inline-flex items-center gap-2 rounded-xl bg-white px-5 py-3 text-sm font-semibold text-black"
          >
            {copy.createAccount}
            <ArrowRight size={16} />
          </Link>
          <Link
            href="/help/hi"
            className="premium-ghost rounded-xl border border-white/10 px-5 py-3 text-sm font-medium text-gray-300"
          >
            {copy.allHelp}
          </Link>
        </div>

        <nav className="flex flex-wrap gap-x-4 gap-y-2 text-sm text-gray-500">
          {HELP_GUIDES_HI.filter((item) => item.slug !== guide.slug).map(
            (item) => (
              <Link
                key={item.slug}
                href={`/help/hi/${item.slug}`}
                className="text-cyan-300/90 underline-offset-2 hover:underline"
              >
                {item.navLabel}
              </Link>
            )
          )}
        </nav>
      </div>
    </MarketingPage>
  );
}
