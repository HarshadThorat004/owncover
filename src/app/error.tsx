"use client";

import Link from "next/link";

import { BRAND_CONTACT_EMAIL } from "@/constants/brand";
import BackgroundGlow from "@/components/background-glow";
import MarketingHeader from "@/components/marketing-header";
import SiteFooter from "@/components/site-footer";

type Props = {
  error: Error;
  reset: () => void;
};

export default function Error({ error, reset }: Props) {
  console.error(error);

  return (
    <div className="relative min-h-screen overflow-hidden bg-[#030304] text-white">
      <BackgroundGlow />
      <MarketingHeader />
      <section className="relative mx-auto flex min-h-[70vh] max-w-xl flex-col items-center justify-center px-5 py-24 text-center">
        <p className="text-[11px] uppercase tracking-[0.16em] text-gray-500">
          Error
        </p>
        <h1 className="font-display mt-4 text-4xl md:text-5xl">
          Something broke on our side.
        </h1>
        <p className="mt-4 text-sm leading-7 text-gray-400">
          Try again. If it keeps happening, email {BRAND_CONTACT_EMAIL}.
        </p>
        <div className="mt-8 flex flex-wrap items-center justify-center gap-3">
          <button
            type="button"
            onClick={reset}
            className="premium-btn premium-btn-solid rounded-xl bg-white px-5 py-3 text-sm font-semibold text-black"
          >
            Try again
          </button>
          <Link
            href="/"
            className="premium-ghost rounded-xl border border-white/10 px-5 py-3 text-sm font-medium text-gray-300"
          >
            Home
          </Link>
        </div>
      </section>
      <SiteFooter />
    </div>
  );
}
