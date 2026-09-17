import type { Metadata } from "next";
import Link from "next/link";
import { ArrowRight } from "lucide-react";

import MarketingPage from "@/components/marketing-page";
import { BRAND_CONTACT_EMAIL, BRAND_NAME } from "@/constants/brand";

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
    body: "Access, correction, or deletion under Indian DPDP rules. We treat these as the same inbox — say so in the subject.",
  },
  {
    title: "Not a claims desk",
    body: `${BRAND_NAME} does not file manufacturer or retailer claims. We cannot call the service centre for you. For a desk visit, print your pack and the original invoice.`,
  },
];

export default function ContactPage() {
  return (
    <MarketingPage
      eyebrow="Contact"
      title="Write to a person. Not a bot."
      lede={`${BRAND_NAME} is a small product. Mail goes to ${BRAND_CONTACT_EMAIL}. We aim to reply within one business day. We do not staff live chat.`}
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
          {TOPICS.map((item) => (
            <section
              key={item.title}
              className="rounded-2xl border border-white/10 p-5"
            >
              <h2 className="text-sm font-medium text-white">{item.title}</h2>
              <p className="mt-2 text-sm leading-7 text-gray-500">{item.body}</p>
            </section>
          ))}
        </div>

        <p className="text-sm leading-7 text-gray-500">
          Desk checklists and GST scan:{" "}
          <Link
            href="/help"
            className="text-cyan-300/90 underline-offset-2 hover:underline"
          >
            Help
          </Link>
          . Do not forward invoices to this address. Use the inbound address in
          Settings, or upload in the vault. Legal:{" "}
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
