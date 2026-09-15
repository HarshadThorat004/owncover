"use client";

import { useState } from "react";
import Link from "next/link";
import {
  Menu,
  X,
  FileText,
  Bell,
  Sparkles,
  ArrowRight,
  Check,
  Minus,
} from "lucide-react";

import BrandLogo from "@/components/brand-logo";
import BackgroundGlow from "@/components/background-glow";
import SiteFooter from "@/components/site-footer";

const FAQS = [
  {
    q: "What does OwnCover actually do?",
    a: "It keeps GST invoices, serials, and expiry dates in one vault, then builds a claim pack you can take to a brand or retailer desk. We do not file claims or run the service centre.",
  },
  {
    q: "How does GST scan work?",
    a: "We read the invoice QR first. If that fails, on-device OCR looks at English and Hindi labels. Unsure fields stay empty — you confirm dates before anything is saved.",
  },
  {
    q: "What is a claim pack?",
    a: "A PDF with invoice facts, serial, cover dates, and a desk checklist. Print it. Do not leave originals behind.",
  },
  {
    q: "What reminders do I get?",
    a: "Email and optional browser alerts at 30 days, 7 days, and the day before manufacturer or store cover ends.",
  },
  {
    q: "Can family share one vault?",
    a: "Yes. A household vault holds the same products and documents for everyone you invite. Each person still has their own sign-in.",
  },
];

export default function HomePage() {
  const [mobileOpen, setMobileOpen] = useState(false);

  return (
    <main className="relative min-h-screen overflow-hidden bg-[#030304] text-white">
      <BackgroundGlow />

      <header className="site-header sticky top-0 z-50">
        <div className="mx-auto flex max-w-6xl items-center justify-between px-5 py-4 md:px-8">
          <Link href="/" className="inline-flex items-center gap-3">
            <BrandLogo
              variant="full"
              size="md"
              tagline="Desk-ready, not desk-side."
            />
          </Link>

          <nav className="hidden items-center gap-7 md:flex">
            <a
              href="#how-it-works"
              className="text-sm text-gray-400 transition-colors duration-200 hover:text-white"
            >
              How it works
            </a>
            <a
              href="#compare"
              className="text-sm text-gray-400 transition-colors duration-200 hover:text-white"
            >
              Compare
            </a>
            <a
              href="#faq"
              className="text-sm text-gray-400 transition-colors duration-200 hover:text-white"
            >
              FAQ
            </a>
            <Link
              href="/login"
              className="text-sm text-gray-400 transition-colors duration-200 hover:text-white"
            >
              Sign in
            </Link>
            <Link
              href="/register"
              className="premium-btn premium-btn-solid rounded-xl bg-white px-4 py-2 text-sm font-semibold text-black"
            >
              Get started
            </Link>
          </nav>

          <button
            type="button"
            className="premium-ghost rounded-xl border border-white/10 p-2 md:hidden"
            onClick={() => setMobileOpen((v) => !v)}
            aria-label={mobileOpen ? "Close menu" : "Open menu"}
          >
            {mobileOpen ? <X size={18} /> : <Menu size={18} />}
          </button>
        </div>

        {mobileOpen && (
          <div className="border-t border-white/10 px-5 py-3 md:hidden">
            <div className="flex flex-col gap-1">
              {[
                ["#how-it-works", "How it works"],
                ["#compare", "Compare"],
                ["#faq", "FAQ"],
              ].map(([href, label]) => (
                <a
                  key={href}
                  href={href}
                  onClick={() => setMobileOpen(false)}
                  className="rounded-xl px-3 py-2.5 text-sm text-gray-300"
                >
                  {label}
                </a>
              ))}
              <Link
                href="/login"
                onClick={() => setMobileOpen(false)}
                className="rounded-xl px-3 py-2.5 text-sm text-gray-300"
              >
                Sign in
              </Link>
              <Link
                href="/register"
                onClick={() => setMobileOpen(false)}
                className="premium-btn premium-btn-solid rounded-xl bg-white px-3 py-2.5 text-center text-sm font-semibold text-black"
              >
                Get started
              </Link>
            </div>
          </div>
        )}
      </header>

      <section className="relative">
        <div className="relative mx-auto max-w-6xl px-5 py-24 text-center md:px-8 md:py-32">
          <p className="eyebrow-pill text-[11px] font-medium uppercase tracking-[0.2em] text-cyan-200/90">
            <span className="h-1.5 w-1.5 rounded-full bg-cyan-300 shadow-[0_0_10px_rgba(34,211,238,0.9)]" />
            For households who actually use the service desk
          </p>
          <h1 className="font-display mx-auto mt-8 max-w-4xl text-[2.5rem] leading-[1.08] md:text-7xl">
            Walk in with facts.
            <br />
            Not a photo roll.
          </h1>
          <p className="mx-auto mt-6 max-w-xl text-base leading-8 text-gray-400">
            Scan GST invoices, track manufacturer vs store cover, and download a
            claim pack before you visit the desk. OwnCover does not run the
            service centre — it gets you desk-ready.
          </p>

          <div className="mt-10 flex flex-wrap items-center justify-center gap-3">
            <Link
              href="/register"
              className="premium-btn premium-btn-solid inline-flex items-center gap-2 rounded-xl bg-white px-5 py-3.5 text-sm font-semibold text-black"
            >
              Create free account
              <ArrowRight size={16} />
            </Link>
            <a
              href="#how-it-works"
              className="premium-ghost rounded-xl border border-white/10 px-5 py-3.5 text-sm font-medium text-gray-300"
            >
              See the first 10 minutes
            </a>
          </div>

          <div className="mx-auto mt-16 grid max-w-3xl grid-cols-3 gap-3">
            {[
              { value: "GST", label: "Invoice facts" },
              { value: "30 / 7 / 1", label: "Day reminders" },
              { value: "PDF", label: "Claim pack" },
            ].map((item) => (
              <div
                key={item.label}
                className="rounded-2xl border border-white/10 px-3 py-5"
              >
                <p className="font-display text-xl text-white md:text-2xl">
                  {item.value}
                </p>
                <p className="mt-1 text-[11px] tracking-wide text-gray-500">
                  {item.label}
                </p>
              </div>
            ))}
          </div>
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
              desc: "30 days, 7 days, and the day before — email and browser.",
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

      <section
        id="features"
        className="relative mx-auto max-w-6xl px-5 pb-24 md:px-8"
      >
        <p className="text-[11px] uppercase tracking-[0.16em] text-gray-500">
          Everything you need. Nothing you don’t.
        </p>
        <h2 className="font-display mt-3 max-w-2xl text-3xl md:text-4xl">
          Outcomes, not another folder.
        </h2>
        <div className="mt-10 grid gap-4 md:grid-cols-3">
          {[
            {
              icon: <FileText size={18} />,
              title: "Desk-ready pack",
              desc: "Invoice facts, serial, and a service-centre checklist in one PDF.",
            },
            {
              icon: <Bell size={18} />,
              title: "Reminders that land",
              desc: "Email and browser alerts at 30 days, 7 days, and the day before cover ends.",
            },
            {
              icon: <Sparkles size={18} />,
              title: "GST-aware scan",
              desc: "QR first, then on-device OCR — English and Hindi labels, empty if unsure.",
            },
          ].map((feature) => (
            <div
              key={feature.title}
              className="premium-card rounded-2xl border border-white/10 p-6"
            >
              <div className="icon-well flex h-10 w-10 items-center justify-center rounded-xl bg-cyan-500/10 text-cyan-300">
                {feature.icon}
              </div>
              <h3 className="mt-5 text-base font-medium">{feature.title}</h3>
              <p className="mt-2 text-sm leading-7 text-gray-500">
                {feature.desc}
              </p>
            </div>
          ))}
        </div>
      </section>

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
                ["Reminders", "30 / 7 / 1 days", "A calendar you forget"],
                ["Desk checklist", "In the claim pack", "You remember at the counter"],
                ["Household sharing", "One vault", "Forward the thread"],
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
        <div className="mt-10 divide-y divide-white/10 border-y border-white/10">
          {FAQS.map((item) => (
            <details key={item.q} className="group py-5">
              <summary className="cursor-pointer list-none text-sm font-medium text-white [&::-webkit-details-marker]:hidden">
                <span className="flex items-start justify-between gap-4">
                  {item.q}
                  <span className="text-gray-600 group-open:hidden">+</span>
                  <span className="hidden text-gray-600 group-open:inline">−</span>
                </span>
              </summary>
              <p className="mt-3 text-sm leading-7 text-gray-400">{item.a}</p>
            </details>
          ))}
        </div>
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
              dates onto one page before you leave the house.
            </p>
            <Link
              href="/register"
              className="premium-btn premium-btn-solid mt-8 inline-flex items-center gap-2 rounded-xl bg-white px-5 py-3.5 text-sm font-semibold text-black"
            >
              Start for free
              <ArrowRight size={16} />
            </Link>
          </div>
        </div>
      </section>

      <SiteFooter />
    </main>
  );
}
