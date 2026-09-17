import type { Metadata } from "next";
import Link from "next/link";
import { ArrowRight, Check, Minus } from "lucide-react";

import MarketingPage from "@/components/marketing-page";
import { BRAND_NAME } from "@/constants/brand";

export const metadata: Metadata = {
  title: "Pricing",
  description: `${BRAND_NAME} is free. No card. Vault, scan, reminders, claim pack, and sharing for homes, shops, gyms, and offices.`,
};

const INCLUDED = [
  "Product vault with invoices, serials, and documents",
  "GST QR + on-device scan — you confirm dates",
  "Manufacturer cover and store / AMC tracked separately",
  "Reminders at 30 days, 7 days, and the day before",
  "Claim pack PDF and category desk checklist",
  "Shared vault — up to five people, each with their own sign-in",
  "Forward marketplace PDFs to your inbound address",
  "CSV and calendar export, account delete anytime",
];

const NOT_INCLUDED = [
  "We do not file claims or run the service centre",
  "No SMS reminders yet",
  "Fair use on email and file storage — this is a free product, not an enterprise workspace",
];

export default function PricingPage() {
  return (
    <MarketingPage
      wide
      eyebrow="Pricing"
      title="Free. No card."
      lede={`${BRAND_NAME} is free to use at home, in a shop, gym, office, or anywhere else you keep GST invoices. If we ever charge for extra storage, extra seats, or SMS, we will say so on this page first — not after you have uploaded bills.`}
    >
      <div className="grid gap-4 lg:grid-cols-[1.2fr_0.8fr]">
        <section className="rounded-2xl border border-cyan-400/20 bg-cyan-400/[0.04] p-7 md:p-8">
          <p className="text-[11px] uppercase tracking-[0.16em] text-cyan-300/80">
            Homes, shops, gyms, offices
          </p>
          <h2 className="font-display mt-3 text-3xl">₹0</h2>
          <p className="mt-2 text-sm text-gray-400">
            Today. No trial clock. Delete anytime.
          </p>
          <ul className="mt-8 space-y-3 text-sm leading-7 text-gray-300">
            {INCLUDED.map((line) => (
              <li key={line} className="flex gap-3">
                <Check size={16} className="mt-1 shrink-0 text-cyan-300" />
                {line}
              </li>
            ))}
          </ul>
          <Link
            href="/register"
            className="premium-btn premium-btn-solid mt-8 inline-flex items-center gap-2 rounded-xl bg-white px-5 py-3 text-sm font-semibold text-black"
          >
            Create free account
            <ArrowRight size={16} />
          </Link>
        </section>

        <div className="flex flex-col gap-4">
          <section className="rounded-2xl border border-white/10 p-7 md:p-8">
            <h2 className="text-base font-medium text-white">Not included</h2>
            <ul className="mt-5 space-y-3 text-sm leading-7 text-gray-500">
              {NOT_INCLUDED.map((line) => (
                <li key={line} className="flex gap-3">
                  <Minus size={16} className="mt-1 shrink-0 text-gray-600" />
                  {line}
                </li>
              ))}
            </ul>
          </section>
          <section className="rounded-2xl border border-white/10 p-7 md:p-8">
            <h2 className="text-base font-medium text-white">Later</h2>
            <p className="mt-3 text-sm leading-7 text-gray-500">
              Paid extras might appear if costs grow — extra file storage,
              extra seats, or SMS. Nothing is billed today. See a{" "}
              <Link
                href="/sample-pack"
                className="text-cyan-300/90 underline-offset-2 hover:underline"
              >
                sample claim pack
              </Link>{" "}
              before you sign up.
            </p>
          </section>
        </div>
      </div>
    </MarketingPage>
  );
}
