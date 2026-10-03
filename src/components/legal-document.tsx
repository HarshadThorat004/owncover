import type { ReactNode } from "react";
import Link from "next/link";

import MarketingShell from "@/components/marketing-shell";

type Props = {
  title: string;
  updated: string;
  children: ReactNode;
  otherHref: string;
  otherLabel: string;
};

export default function LegalDocument({
  title,
  updated,
  children,
  otherHref,
  otherLabel,
}: Props) {
  return (
    <MarketingShell>
      <article className="relative mx-auto max-w-3xl px-5 py-16 md:px-8 md:py-20">
        <p className="text-[11px] uppercase tracking-[0.16em] text-cyan-300/80">
          Legal
        </p>
        <h1 className="hero-enter font-display mt-4 text-3xl md:text-4xl">
          {title}
        </h1>
        <p className="mt-3 text-sm text-white/40">Last updated: {updated}</p>

        <div className="mt-10 space-y-8">{children}</div>

        <p className="mt-12 text-sm text-white/40">
          <Link
            href="/login"
            className="underline underline-offset-2 hover:text-white/70"
          >
            Back to log in
          </Link>
          <span className="mx-2 text-white/20">·</span>
          <Link
            href={otherHref}
            className="underline underline-offset-2 hover:text-white/70"
          >
            {otherLabel}
          </Link>
        </p>
      </article>
    </MarketingShell>
  );
}
