import type { Metadata } from "next";
import Link from "next/link";
import { ArrowRight, Check, Minus } from "lucide-react";

import FeatureCarousel from "@/components/feature-carousel";
import FaqList from "@/components/faq-list";
import HeroArtifact from "@/components/hero-artifact";
import JsonLd from "@/components/json-ld";
import MarketingShell from "@/components/marketing-shell";
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

const FEATURE_SLIDES = [
  {
    title: "Desk-ready claim pack",
    desc: "Invoice facts, serial, and a service-centre checklist in one PDF — print it before you go to the desk.",
    image: "/brand/features/claim-pack.png",
    imageAlt: "Claim pack document with cyan glow",
  },
  {
    title: "Reminders that land",
    desc: "Email and browser alerts at 30 days, 7 days, and the day before — plus a calendar file for Google or Apple Calendar.",
    image: "/brand/features/reminders.png",
    imageAlt: "Reminder notifications and calendar markers",
  },
  {
    title: "GST-aware scan",
    desc: "QR first, then on-device OCR — English and Hindi labels, empty if unsure. You confirm dates before save.",
    image: "/brand/features/gst-scan.png",
    imageAlt: "GST invoice scan with holographic beam",
  },
  {
    title: "Shared vault",
    desc: "Share one vault with family or staff — home, shop, gym, or office. Same products, documents, and expiry reminders. Each person still has their own sign-in.",
    image: "/brand/features/household.png",
    imageAlt: "Shared vault network",
  },
  {
    title: "Coverage timeline",
    desc: "See purchase through manufacturer cover, then store or AMC — so you know which date still matters at the desk.",
    image: "/brand/features/timeline.png",
    imageAlt: "Warranty coverage timeline nodes",
  },
];

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
        <div className="relative mx-auto max-w-6xl px-5 py-16 text-center md:px-8 md:py-24">
          <p className="eyebrow-pill text-[11px] font-medium uppercase tracking-[0.2em] text-cyan-200/90">
            <span className="h-1.5 w-1.5 rounded-full bg-cyan-300 shadow-[0_0_10px_rgba(34,211,238,0.9)]" />
            For homes, shops, gyms, and offices that use the service desk
          </p>
          <h1 className="font-display mx-auto mt-8 max-w-4xl text-[2.5rem] leading-[1.08] md:text-7xl">
            Walk in with facts.
            <br />
            Not a photo roll.
          </h1>
          <p className="mx-auto mt-6 max-w-xl text-base leading-8 text-gray-400">
            Scan GST invoices, track manufacturer vs store cover, and download a
            claim pack before you visit the desk. Same vault for a house, a shop
            floor, a gym, an office — OwnCover still does not run the service
            centre.
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
              First 10 minutes
            </a>
          </p>

          <div className="mx-auto mt-14 max-w-5xl text-left">
            <HeroArtifact />
          </div>

          <p className="mx-auto mt-6 max-w-2xl text-[12px] leading-6 tracking-wide text-gray-600">
            GST QR first · On-device scan when we can · You confirm dates ·
            Delete anytime
          </p>
        </div>
      </section>

      <section className="relative mx-auto max-w-6xl px-5 pb-24 md:px-8">
        <div className="grid gap-4 md:grid-cols-2">
          <div className="rounded-2xl border border-white/10 p-7 md:p-8">
            <p className="text-[11px] uppercase tracking-[0.16em] text-gray-500">
              Without OwnCover
            </p>
            <h2 className="font-display mt-3 text-2xl md:text-3xl">
              A folder of bills and a calendar you forget.
            </h2>
            <ul className="mt-6 space-y-3 text-sm leading-7 text-gray-400">
              {[
                "GST invoices buried in email, SMS, and WhatsApp",
                "Serial that does not match the box at the desk",
                "Store cover ends and nobody flagged it",
                "You arrive with a screenshot. They want a printed tax invoice.",
              ].map((line) => (
                <li key={line} className="flex gap-3">
                  <Minus size={16} className="mt-1 shrink-0 text-red-400/80" />
                  {line}
                </li>
              ))}
            </ul>
          </div>
          <div className="rounded-2xl border border-cyan-400/20 bg-cyan-400/[0.04] p-7 md:p-8">
            <p className="text-[11px] uppercase tracking-[0.16em] text-cyan-300/80">
              With OwnCover
            </p>
            <h2 className="font-display mt-3 text-2xl md:text-3xl">
              One vault. A pack the desk can use.
            </h2>
            <ul className="mt-6 space-y-3 text-sm leading-7 text-gray-300">
              {[
                "Invoice facts, serial, and dates in one place",
                "Manufacturer and store cover tracked separately",
                "Reminders at 30 days, 7 days, and the day before",
                "Claim pack + desk checklist, printed before you leave",
              ].map((line) => (
                <li key={line} className="flex gap-3">
                  <Check size={16} className="mt-1 shrink-0 text-cyan-300" />
                  {line}
                </li>
              ))}
            </ul>
          </div>
        </div>
      </section>

      <section
        id="how-it-works"
        className="relative mx-auto max-w-6xl px-5 pb-24 md:px-8"
      >
        <p className="text-[11px] uppercase tracking-[0.16em] text-gray-500">
          The first 10 minutes
        </p>
        <h2 className="font-display mt-3 max-w-2xl text-3xl md:text-4xl">
          Scan once. Walk in prepared.
        </h2>
        <div className="mt-10 grid gap-4 md:grid-cols-4">
          {[
            {
              n: "01",
              title: "Scan the GST bill",
              desc: "QR first, then OCR. Amazon, Flipkart, Croma — empty if unsure.",
            },
            {
              n: "02",
              title: "Confirm the dates",
              desc: "Purchase, manufacturer cover, store or AMC if you have it.",
            },
            {
              n: "03",
              title: "Reminders go live",
              desc: "30 days, 7 days, and the day before — email, browser, and a calendar file.",
            },
            {
              n: "04",
              title: "Download the pack",
              desc: "Invoice facts, serial, and a desk checklist in one PDF.",
            },
          ].map((step) => (
            <div
              key={step.n}
              className="rounded-2xl border border-white/10 p-5 md:p-6"
            >
              <p className="font-display text-sm text-white/30">{step.n}</p>
              <h3 className="mt-3 text-base font-medium text-white">
                {step.title}
              </h3>
              <p className="mt-2 text-sm leading-7 text-gray-500">{step.desc}</p>
            </div>
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

      <FeatureCarousel items={FEATURE_SLIDES} />

      <section
        id="compare"
        className="relative mx-auto max-w-6xl px-5 pb-24 md:px-8"
      >
        <p className="text-[11px] uppercase tracking-[0.16em] text-gray-500">
          OwnCover vs a PDF folder
        </p>
        <h2 className="font-display mt-3 max-w-2xl text-3xl md:text-4xl">
          Same invoices. A different morning at the desk.
        </h2>
        <div className="mt-10 overflow-x-auto rounded-2xl border border-white/10">
          <table className="w-full text-left text-sm">
            <thead className="border-b border-white/10 text-gray-500">
              <tr>
                <th className="px-5 py-3.5 font-medium">Capability</th>
                <th className="px-5 py-3.5 font-medium text-white">OwnCover</th>
                <th className="px-5 py-3.5 font-medium">Folder / WhatsApp</th>
              </tr>
            </thead>
            <tbody className="text-gray-400">
              {[
                ["GST invoice facts", "Extracted and stored", "Scattered photos"],
                ["Manufacturer vs store cover", "Tracked separately", "One date, if any"],
                ["Email-forward invoices", "Draft in your vault", "Search the thread"],
                ["Reminders", "30 / 7 / 1 days + calendar file", "A calendar you forget"],
                ["Desk checklist", "In the claim pack", "You remember at the counter"],
                ["Shared vault", "Family or staff, one vault", "Forward the thread"],
              ].map(([cap, ours, theirs]) => (
                <tr key={cap} className="border-t border-white/5">
                  <td className="px-5 py-3.5 text-gray-300">{cap}</td>
                  <td className="px-5 py-3.5 text-cyan-200/90">{ours}</td>
                  <td className="px-5 py-3.5">{theirs}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </section>

      <section id="faq" className="relative mx-auto max-w-3xl px-5 pb-24 md:px-8">
        <p className="text-center text-[11px] uppercase tracking-[0.16em] text-gray-500">
          FAQ
        </p>
        <h2 className="font-display mt-3 text-center text-3xl md:text-4xl">
          Straight answers
        </h2>
        <div className="mt-10">
          <FaqList items={homeFaqs} />
        </div>
        <p className="mt-6 text-center text-sm text-gray-500">
          Desk checklists and GST scan:{" "}
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
        <div className="relative overflow-hidden rounded-3xl border border-white/10 px-6 py-12 text-center md:px-12 md:py-16">
          <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(ellipse_at_top,rgba(34,211,238,0.12),transparent_55%)]" />
          <div className="relative">
            <h2 className="font-display text-3xl md:text-5xl">
              Walk in prepared.
            </h2>
            <p className="mx-auto mt-4 max-w-md text-sm leading-7 text-gray-400">
              We don’t run the service centre. We get the invoice, serial, and
              dates onto one page before you go to the desk.
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
