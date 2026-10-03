import type { Metadata } from "next";
import Link from "next/link";

import MarketingPage from "@/components/marketing-page";
import Reveal from "@/components/reveal";
import { BRAND_CONTACT_EMAIL, BRAND_NAME } from "@/constants/brand";

export const metadata: Metadata = {
  title: "Security & privacy",
  description: `How ${BRAND_NAME} scans invoices, who can see a shared vault, and how you delete your data.`,
};

const PRACTICES = [
  {
    title: "On-device scan when we can",
    body: "Camera and photo OCR usually run in your browser. The image is stored only if you save the product. Unsure fields stay empty until you confirm.",
  },
  {
    title: "PDFs on our servers",
    body: "Marketplace invoice PDFs are parsed on the server because browsers cannot reliably extract that text. GST QR is read first when it is present.",
  },
  {
    title: "Not for sale. Not for public models",
    body: "We do not sell personal data. We do not use your warranty documents to train public AI models.",
  },
  {
    title: "Shared household vault",
    body: "Up to five people, all 18+. Members see shared products, documents, reminders, and inbound drafts. Invite only people you trust. Each person keeps their own sign-in.",
  },
  {
    title: "You can leave with your data",
    body: "Export CSV and calendar from Settings. Download a claim pack per product. Delete a product or the whole account — uploaded files are removed from storage.",
  },
  {
    title: "Passwords and access",
    body: "Password sign-in stores a hash, not the password. You can use Google or email OTP. HTTPS on the site. Dashboard routes require a session.",
  },
];

export default function SecurityPage() {
  return (
    <MarketingPage
      wide
      eyebrow="Security"
      title="Your invoices are a vault. Not a dataset."
      lede={`${BRAND_NAME} stores GST bills, serials, and cover dates. We treat that as custody, not content to mine.`}
    >
      <div className="grid gap-4 sm:grid-cols-2">
        {PRACTICES.map((item, index) => (
          <Reveal key={item.title} delay={index * 0.06}>
            <section className="premium-card h-full rounded-2xl border border-white/10 p-6">
              <h2 className="text-base font-medium text-white">{item.title}</h2>
              <p className="mt-2 text-sm leading-7 text-gray-500">{item.body}</p>
            </section>
          </Reveal>
        ))}
      </div>

      <Reveal delay={0.1}>
        <section className="mt-10 rounded-2xl border border-white/10 p-6 md:p-8">
          <h2 className="text-base font-medium text-white">
            What we do not claim
          </h2>
          <p className="mt-2 text-sm leading-7 text-gray-500">
            We do not flash SOC 2 badges we do not have. Files live with our
            storage provider; the database is PostgreSQL on our host. GSTIN,
            address, and phone printed on an invoice stay inside the file you
            uploaded — we do not copy GSTIN into a separate product field.
          </p>
          <p className="mt-4 text-sm leading-7 text-gray-500">
            If you are in India you have rights under the Digital Personal Data
            Protection Act, 2023. The full notice is on{" "}
            <Link
              href="/privacy"
              className="text-cyan-300/90 underline-offset-2 hover:underline"
            >
              Privacy
            </Link>
            . Privacy and deletion requests:{" "}
            <a
              href={`mailto:${BRAND_CONTACT_EMAIL}`}
              className="text-cyan-300/90 underline-offset-2 hover:underline"
            >
              {BRAND_CONTACT_EMAIL}
            </a>
            .
          </p>
        </section>
      </Reveal>
    </MarketingPage>
  );
}
