import type { Metadata } from "next";

import MarketingShell from "@/components/marketing-shell";
import NotFoundActions from "@/components/not-found-actions";

export const metadata: Metadata = {
  title: "Page not found",
  description: "This OwnCover page does not exist.",
};

export default function NotFound() {
  return (
    <MarketingShell>
      <section className="relative mx-auto flex min-h-[70vh] max-w-xl flex-col items-center justify-center px-5 py-24 text-center">
        <p className="text-[11px] uppercase tracking-[0.16em] text-cyan-300/80">
          404
        </p>
        <h1 className="hero-enter font-display mt-4 text-4xl md:text-5xl">
          This page is not in the vault.
        </h1>
        <p className="mt-4 text-sm leading-7 text-gray-400">
          The link is wrong, expired, or the page was moved.
        </p>
        <NotFoundActions />
      </section>
    </MarketingShell>
  );
}

