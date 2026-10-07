import type { Metadata } from "next";
import Link from "next/link";
import { ArrowRight } from "lucide-react";

import MarketingPage from "@/components/marketing-page";
import Reveal from "@/components/reveal";
import { BRAND_CONTACT_EMAIL, BRAND_NAME } from "@/constants/brand";
export const revalidate = 86_400;

export const metadata: Metadata = {
  title: "Contact",
  description: `Email ${BRAND_CONTACT_EMAIL}. We aim to reply within one business day.`,
};

const TOPICS = [
  {
    title: "Product or account",
    body: "Sign-in, scan, vault invite, inbound address, or a claim pack that looks wrong. Include the email on the account.",
  },
  {
    title: "Privacy or deletion",
    body: "Access, correction, or deletion under Indian DPDP rules. Say so in the subject line.",
  },
  {
    title: "Warranty claims",
    body: `${BRAND_NAME} does not file manufacturer or retailer claims. For product support, contact the brand or retailer directly.`,
  },
];

export default function ContactPage() {
  return (
    <MarketingPage
      eyebrow="Contact"
      title="Write to us."
      lede={`${BRAND_NAME} is a small product. Mail goes to ${BRAND_CONTACT_EMAIL}. We aim to reply within one business day.`}
    >
      <div className="space-y-10">
        <a
          href={`mailto:${BRAND_CONTACT_EMAIL}?subject=${encodeURIComponent("OwnCover")}`}
          className="premium-btn premium-btn-solid inline-flex items-center gap-2 rounded-xl bg-white px-5 py-3.5 text-sm font-semibold text-black"
        >
          {BRAND_CONTACT_EMAIL}
          <ArrowRight size={16} />
        </a>

        <div className="grid gap-4 sm:grid-cols-3">
          {TOPICS.map((item, index) => (
            <Reveal key={item.title} delay={index * 0.08}>
              <section className="premium-card h-full rounded-2xl border border-white/10 p-5">
                <h2 className="text-sm font-medium text-white">{item.title}</h2>
                <p className="mt-2 text-sm leading-7 text-gray-500">{item.body}</p>
              </section>
            </Reveal>
          ))}
        </div>

        <p className="text-sm leading-7 text-gray-500">
          GST scan and category guides:{" "}
          <Link
            href="/help"
            className="text-cyan-300/90 underline-offset-2 hover:underline"
          >
            Help
          </Link>
          . Do not forward invoices to this address — use the inbound address in
          Settings. Legal:{" "}
          <Link
            href="/privacy"
            className="text-cyan-300/90 underline-offset-2 hover:underline"
          >
            Privacy
          </Link>{" "}
          and{" "}
          <Link
            href="/terms"
            className="text-cyan-300/90 underline-offset-2 hover:underline"
          >
            Terms
          </Link>
          .
        </p>
      </div>
    </MarketingPage>
  );
}
