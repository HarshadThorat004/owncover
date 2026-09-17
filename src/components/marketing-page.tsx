import type { ReactNode } from "react";

import MarketingShell from "@/components/marketing-shell";

type Props = {
  eyebrow: string;
  title: string;
  lede: string;
  children: ReactNode;
  wide?: boolean;
  lang?: string;
};

export default function MarketingPage({
  eyebrow,
  title,
  lede,
  children,
  wide = false,
  lang,
}: Props) {
  return (
    <MarketingShell>
      <article
        lang={lang}
        className={`relative mx-auto px-5 py-16 md:px-8 md:py-20 ${
          wide ? "max-w-5xl" : "max-w-3xl"
        }`}
      >
        <p className="text-[11px] uppercase tracking-[0.16em] text-cyan-300/80">
          {eyebrow}
        </p>
        <h1 className="font-display mt-4 text-4xl leading-[1.1] md:text-5xl">
          {title}
        </h1>
        <p className="mt-5 max-w-2xl text-base leading-8 text-gray-400">
          {lede}
        </p>
        <div className="mt-12">{children}</div>
      </article>
    </MarketingShell>
  );
}
