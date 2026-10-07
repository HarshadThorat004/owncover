import type { Metadata } from "next";
import Link from "next/link";
import {
  ArrowRight,
  Check,
  Inbox,
  Languages,
  ScanLine,
  ShieldCheck,
} from "lucide-react";

import FaqList from "@/components/faq-list";
import JsonLd from "@/components/json-ld";
import MarketingShell from "@/components/marketing-shell";
import HomeProductFilm from "@/components/home-product-film";
import HomeVaultStage from "@/components/home-vault-stage";
import Reveal from "@/components/reveal";
import VaultPreview from "@/components/vault-preview";
import {
  BRAND_DESCRIPTION,
  BRAND_INBOUND_DOMAIN,
  BRAND_TITLE,
} from "@/constants/brand";
import { faqsForHome } from "@/constants/faqs";
import { getAppBaseUrl } from "@/lib/app-url";
import {
  BRAND_KEYWORDS,
  buildFaqPageJsonLd,
  buildOrganizationJsonLd,
  buildSoftwareApplicationJsonLd,
  buildWebSiteJsonLd,
} from "@/lib/seo";

export const metadata: Metadata = {
  title: BRAND_TITLE,
  description: BRAND_DESCRIPTION,
  keywords: [...BRAND_KEYWORDS],
  alternates: {
    canonical: "/",
  },
};

const HERO_STATS = [
  { value: "GST QR", label: "Invoice scan" },
  { value: "30 · 7 · 1", label: "Expiry alerts" },
  { value: "Family", label: "Shared vault" },
];

const FEATURE_SLIDES = [
  {
    title: "GST invoice scan",
    desc: "Reads the GST QR first. If that fails, on-device OCR picks up English and Hindi. You confirm every field before it is saved.",
    image: "/brand/features/gst-scan.png",
    imageAlt: "GST invoice scan with holographic beam",
  },
  {
    title: "Cover timeline",
    desc: "Brand warranty, store warranty, and AMC on one timeline — so you know which cover is still running.",
    image: "/brand/features/timeline.png",
    imageAlt: "Warranty coverage timeline nodes",
  },
  {
    title: "Expiry reminders",
    desc: "Email and optional browser alerts at 30 days, 7 days, and 1 day before a cover ends.",
    image: "/brand/features/reminders.png",
    imageAlt: "Reminder notifications and calendar markers",
  },
  {
    title: "Claim pack",
    desc: "One PDF with invoice facts, serial number, and cover dates. Share or print when you raise a warranty request.",
    image: "/brand/features/claim-pack.png",
    imageAlt: "Claim pack document with cyan glow",
  },
  {
    title: "Household vault",
    desc: "Invite family into one vault. Same products, documents, and reminders — each person keeps their own sign-in.",
    image: "/brand/features/household.png",
    imageAlt: "Shared household vault network",
  },
];

const WHY = [
  {
    icon: ScanLine,
    title: "GST invoices first",
    desc: "The QR on an Indian tax invoice is read before anything else. OCR is only the backup.",
  },
  {
    icon: Languages,
    title: "English and Hindi",
    desc: "Labels in both languages are read. Unclear fields stay empty for you to fill.",
  },
  {
    icon: Inbox,
    title: "Forward a marketplace bill",
    desc: "Send an Amazon or Flipkart invoice PDF to your private OwnCover address, then review it in the vault.",
  },
  {
    icon: ShieldCheck,
    title: "You approve every save",
    desc: "Scans never write themselves in. Review the record, then keep or discard it.",
  },
];

/** Marketing shell is static; user-specific UI lives on /dashboard. */
export const revalidate = 3600;

export default function HomePage() {
  const baseUrl = getAppBaseUrl();
  const homeFaqs = faqsForHome();

  return (
    <>
      <JsonLd
        data={[
          buildOrganizationJsonLd(baseUrl),
          buildWebSiteJsonLd(baseUrl),
          buildSoftwareApplicationJsonLd(baseUrl),
          buildFaqPageJsonLd(homeFaqs, baseUrl),
        ]}
      />
      <MarketingShell>
      <section className="relative">
        <div className="hero-enter relative mx-auto max-w-6xl px-5 py-16 text-center md:px-8 md:py-24">
          <p className="eyebrow-pill text-[11px] font-medium uppercase tracking-[0.2em] text-cyan-200/90">
            <span className="h-1.5 w-1.5 rounded-full bg-cyan-300 shadow-[0_0_10px_rgba(34,211,238,0.9)]" />
            Warranty records for Indian homes
          </p>
          <h1 className="font-display mx-auto mt-8 max-w-4xl text-[2.5rem] leading-[1.08] md:text-6xl lg:text-7xl">
            Every bill.
            <br />
            <span className="text-gradient">Every cover date.</span>
          </h1>
          <p className="mx-auto mt-6 max-w-2xl text-base leading-8 text-gray-400">
            Scan a GST invoice or forward an Amazon or Flipkart PDF. OwnCover
            keeps the product, the documents, and the dates — and reminds you
            before cover ends.
          </p>

          <div className="mt-10 flex flex-wrap items-center justify-center gap-3">
            <Link
              href="/register"
              className="premium-btn premium-btn-solid inline-flex items-center gap-2 rounded-xl bg-white px-5 py-3.5 text-sm font-semibold text-black"
            >
              Create free account
              <ArrowRight size={16} />
            </Link>
            <Link
              href="/sample-pack"
              className="premium-ghost rounded-xl border border-white/10 px-5 py-3.5 text-sm font-medium text-gray-300"
            >
              See a sample pack
            </Link>
          </div>
          <p className="mt-4 text-sm text-gray-500">
            No card.{" "}
            <Link
              href="/pricing"
              className="text-gray-400 underline-offset-4 hover:text-white hover:underline"
            >
              See what&apos;s included
            </Link>
            {" · "}
            <a
              href="#how-it-works"
              className="text-gray-400 underline-offset-4 hover:text-white hover:underline"
            >
              See how it works
            </a>
          </p>
        </div>

        <div className="relative mx-auto mt-12 max-w-5xl px-5 md:mt-16 md:px-8">
          <HomeVaultStage />
        </div>

        <div className="mx-auto mt-8 grid max-w-3xl grid-cols-3 gap-3 px-5 pb-20 md:px-8 md:pb-28">
          {HERO_STATS.map((item) => (
            <div
              key={item.label}
              className="rounded-2xl border border-white/10 px-3 py-5 text-center"
            >
              <p className="font-display text-lg text-white sm:text-xl md:text-2xl">
                {item.value}
              </p>
              <p className="mt-1 text-[11px] tracking-wide text-gray-500">
                {item.label}
              </p>
            </div>
          ))}
        </div>
      </section>

      <section
        id="how-it-works"
        className="relative mx-auto max-w-6xl px-5 pb-24 md:px-8"
      >
        <p className="text-[11px] uppercase tracking-[0.16em] text-cyan-300/80">
          How it works
        </p>
        <h2 className="font-display mt-3 max-w-2xl text-3xl md:text-4xl">
          Add a bill. The record stays organised.
        </h2>
        <div className="mt-10 grid gap-4 md:grid-cols-4">
          {[
            {
              n: "01",
              title: "Add the invoice",
              desc: "Scan the GST QR, forward an Amazon or Flipkart PDF, or type the details in.",
            },
            {
              n: "02",
              title: "Confirm the dates",
              desc: "Check purchase date, brand warranty, and any store or AMC cover.",
            },
            {
              n: "03",
              title: "Get reminded",
              desc: "Alerts at 30, 7, and 1 day before cover ends — email, browser, and calendar.",
            },
            {
              n: "04",
              title: "Download the pack",
              desc: "Invoice facts, serial, and cover dates in one PDF when you need them.",
            },
          ].map((step, index) => (
            <Reveal key={step.n} className="h-full" delay={index * 0.08}>
              <div className="premium-card h-full rounded-2xl border border-white/10 p-5 md:p-6">
                <p className="font-display text-sm text-cyan-200/60">{step.n}</p>
                <h3 className="mt-3 text-base font-medium text-white">
                  {step.title}
                </h3>
                <p className="mt-2 text-sm leading-7 text-gray-500">{step.desc}</p>
              </div>
            </Reveal>
          ))}
        </div>
      </section>

      <section className="relative mx-auto max-w-6xl px-5 pb-24 md:px-8">
        <div className="grid gap-6 overflow-hidden rounded-3xl border border-white/10 md:grid-cols-2">
          <div className="p-7 md:p-10">
            <p className="text-[11px] uppercase tracking-[0.16em] text-cyan-300/80">
              Already in your inbox
            </p>
            <h2 className="font-display mt-3 text-2xl md:text-3xl">
              Forward the Amazon PDF
            </h2>
            <p className="mt-4 text-sm leading-7 text-gray-400">
              After you sign in, Settings shows a private address on{" "}
              {BRAND_INBOUND_DOMAIN}. Forward Flipkart, Amazon, or Croma
              invoices. We start a draft. You confirm dates. Then download a
              pack.
            </p>
            <Link
              href="/register"
              className="premium-btn premium-btn-solid mt-6 inline-flex items-center gap-2 rounded-xl bg-white px-5 py-3 text-sm font-semibold text-black"
            >
              Create free account
              <ArrowRight size={16} />
            </Link>
          </div>
          <div className="flex flex-col justify-center border-t border-white/10 bg-cyan-400/[0.04] p-7 md:border-l md:border-t-0 md:p-10">
            <p className="text-[11px] uppercase tracking-[0.16em] text-gray-500">
              Calendar
            </p>
            <h3 className="mt-3 text-lg font-medium text-white">
              Add expiry to Google or Apple Calendar
            </h3>
            <p className="mt-3 text-sm leading-7 text-gray-400">
              Email and browser at 30 / 7 / 1 days. Download an .ics file from
              any product so the date also lives next to your other reminders.
            </p>
          </div>
        </div>
      </section>

      <HomeProductFilm
        items={FEATURE_SLIDES}
        eyebrow="Features"
        heading="What stays in the vault."
      />

      <section className="relative mx-auto max-w-6xl px-5 pb-24 md:px-8">
        <div className="grid items-center gap-10 md:grid-cols-2 md:gap-14">
          <Reveal>
            <p className="text-[11px] uppercase tracking-[0.16em] text-cyan-300/80">
              Your vault
            </p>
            <h2 className="font-display mt-3 max-w-md text-3xl md:text-4xl">
              See what is still covered.
            </h2>
            <p className="mt-4 max-w-md text-sm leading-7 text-gray-400">
              Each product shows its active cover, days left, and the invoice
              attached to it.
            </p>
            <ul className="mt-6 space-y-3 text-sm leading-7 text-gray-300">
              {[
                "Brand, store, and AMC cover tracked separately",
                "Active, ending soon, and expired — in one list",
                "Invoice and documents attached to each product",
              ].map((line) => (
                <li key={line} className="flex gap-3">
                  <Check size={16} className="mt-1 shrink-0 text-cyan-300" />
                  {line}
                </li>
              ))}
            </ul>
          </Reveal>
          <Reveal delay={0.12}>
            <VaultPreview />
          </Reveal>
        </div>
      </section>

      <section
        id="why"
        className="relative mx-auto max-w-6xl px-5 pb-24 md:px-8"
      >
        <p className="text-[11px] uppercase tracking-[0.16em] text-cyan-300/80">
          Why OwnCover
        </p>
        <h2 className="font-display mt-3 max-w-2xl text-3xl md:text-4xl">
          Built around Indian invoices.
        </h2>
        <div className="mt-10 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          {WHY.map((item, index) => (
            <Reveal key={item.title} className="h-full" delay={index * 0.08}>
              <div className="premium-card h-full rounded-2xl border border-white/10 p-6">
                <div className="icon-well flex h-11 w-11 items-center justify-center rounded-xl bg-cyan-400/10 text-cyan-300">
                  <item.icon size={20} />
                </div>
                <h3 className="mt-5 text-base font-medium text-white">
                  {item.title}
                </h3>
                <p className="mt-2 text-sm leading-7 text-gray-500">
                  {item.desc}
                </p>
              </div>
            </Reveal>
          ))}
        </div>
      </section>

      <section id="faq" className="relative mx-auto max-w-3xl px-5 pb-24 md:px-8">
        <p className="text-center text-[11px] uppercase tracking-[0.16em] text-cyan-300/80">
          FAQ
        </p>
        <h2 className="font-display mt-3 text-center text-3xl md:text-4xl">
          Common questions
        </h2>
        <div className="mt-10">
          <FaqList items={homeFaqs} />
        </div>
        <p className="mt-6 text-center text-sm text-gray-500">
          Category guides and more answers in{" "}
          <Link
            href="/help"
            className="text-cyan-300/90 underline-offset-2 hover:underline"
          >
            Help
          </Link>
          .
        </p>
      </section>

      <section className="relative mx-auto max-w-6xl px-5 pb-24 md:px-8">
        <div className="beam-card relative overflow-hidden rounded-3xl border border-white/10 px-6 py-12 text-center md:px-12 md:py-16">
          <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(ellipse_at_top,rgba(34,211,238,0.12),transparent_55%)]" />
          <div className="relative">
            <h2 className="font-display text-3xl md:text-5xl">
              Add your first invoice.
            </h2>
            <p className="mx-auto mt-4 max-w-md text-sm leading-7 text-gray-400">
              Free to start. Scan a GST bill or enter the dates yourself.
            </p>
            <div className="mt-8 flex flex-wrap items-center justify-center gap-3">
              <Link
                href="/register"
                className="premium-btn premium-btn-solid inline-flex items-center gap-2 rounded-xl bg-white px-5 py-3.5 text-sm font-semibold text-black"
              >
                Start for free
                <ArrowRight size={16} />
              </Link>
              <Link
                href="/sample-pack"
                className="premium-ghost rounded-xl border border-white/10 px-5 py-3.5 text-sm font-medium text-gray-300"
              >
                See a sample pack
              </Link>
            </div>
          </div>
        </div>
      </section>
    </MarketingShell>
    </>
  );
}
