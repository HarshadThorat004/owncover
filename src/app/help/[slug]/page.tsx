import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { ArrowRight } from "lucide-react";

import HelpLangSwitch from "@/components/help-lang-switch";
import MarketingPage from "@/components/marketing-page";
import { BRAND_NAME } from "@/constants/brand";
import { categoryLabel } from "@/constants/catalog";
import {
  getHelpGuide,
  HELP_GUIDES,
  helpGuideChecklist,
} from "@/constants/help-guides";

type Props = {
  params: Promise<{ slug: string }>;
};

export function generateStaticParams() {
  return HELP_GUIDES.map((guide) => ({ slug: guide.slug }));
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params;
  const guide = getHelpGuide(slug);

  if (!guide) {
    return { title: "Help" };
  }

  return {
    title: `${guide.title} — Help`,
    description: `${guide.lede} ${BRAND_NAME}.`,
    alternates: {
      languages: {
        en: `/help/${slug}`,
        hi: `/help/hi/${slug}`,
      },
    },
  };
}

export default async function HelpGuidePage({ params }: Props) {
  const { slug } = await params;
  const guide = getHelpGuide(slug);

  if (!guide) {
    notFound();
  }

  const checklist = helpGuideChecklist(guide);

  return (
    <MarketingPage
      eyebrow="Help"
      title={guide.title}
      lede={guide.lede}
    >
      <div className="space-y-10">
        <HelpLangSwitch locale="en" slug={guide.slug} />

        <p className="text-sm text-gray-500">
          Category in the vault: {categoryLabel(guide.category)}.{" "}
          {BRAND_NAME} does not file this claim.
        </p>

        <section className="premium-card rounded-2xl border border-white/10 p-5 md:p-6">
          <h2 className="text-sm font-medium text-white">
            {checklist.title}
          </h2>
          <ul className="mt-4 space-y-2.5">
            {checklist.items.map((item) => (
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
          <h2 className="text-base font-medium text-white">Good to know</h2>
          <ul className="mt-4 space-y-3">
            {guide.notes.map((note) => (
              <li key={note} className="text-sm leading-7 text-gray-400">
                {note}
              </li>
            ))}
          </ul>
        </section>

        <p className="text-sm leading-7 text-gray-500">
          Scan the GST bill, confirm the dates, download the pack. Print the
          invoice too. Keep the original invoice with you.
        </p>

        <div className="flex flex-wrap gap-3">
          <Link
            href="/register"
            className="premium-btn premium-btn-solid inline-flex items-center gap-2 rounded-xl bg-white px-5 py-3 text-sm font-semibold text-black"
          >
            Create free account
            <ArrowRight size={16} />
          </Link>
          <Link
            href="/help"
            className="premium-ghost rounded-xl border border-white/10 px-5 py-3 text-sm font-medium text-gray-300"
          >
            All help
          </Link>
        </div>

        <nav className="flex flex-wrap gap-x-4 gap-y-2 text-sm text-gray-500">
          {HELP_GUIDES.filter((item) => item.slug !== guide.slug).map((item) => (
            <Link
              key={item.slug}
              href={`/help/${item.slug}`}
              className="text-cyan-300/90 underline-offset-2 hover:underline"
            >
              {item.navLabel}
            </Link>
          ))}
        </nav>
      </div>
    </MarketingPage>
  );
}
