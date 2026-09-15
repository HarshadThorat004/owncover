import Link from "next/link";

import BrandLogo from "@/components/brand-logo";
import { BRAND_CONTACT_EMAIL } from "@/constants/brand";

const CONTACT_EMAIL = BRAND_CONTACT_EMAIL;

export default function SiteFooter() {
  const year = new Date().getFullYear();

  return (
    <footer className="relative border-t border-white/10 bg-[#030304]/80">
      <div className="mx-auto flex max-w-6xl flex-col gap-8 px-5 py-10 md:flex-row md:items-start md:justify-between md:px-8 md:py-12">
        <div className="max-w-sm">
          <BrandLogo
            variant="full"
            size="sm"
            tagline="Your warranty. Our responsibility."
          />
          <p className="mt-4 text-sm leading-6 text-gray-500">
            Scan GST invoices, track manufacturer and store cover, and walk into
            a service centre with a claim pack. We do not run the desk.
          </p>
        </div>

        <div className="flex flex-wrap gap-10 sm:gap-14">
          <div>
            <p className="text-xs font-medium uppercase tracking-[0.16em] text-gray-500">
              Product
            </p>
            <ul className="mt-3 space-y-2.5 text-sm text-gray-400">
              <li>
                <a href="#how-it-works" className="transition hover:text-white">
                  How it works
                </a>
              </li>
              <li>
                <a href="#compare" className="transition hover:text-white">
                  Compare
                </a>
              </li>
              <li>
                <a href="#faq" className="transition hover:text-white">
                  FAQ
                </a>
              </li>
              <li>
                <Link href="/register" className="transition hover:text-white">
                  Get started
                </Link>
              </li>
              <li>
                <Link href="/login" className="transition hover:text-white">
                  Sign in
                </Link>
              </li>
            </ul>
          </div>

          <div>
            <p className="text-xs font-medium uppercase tracking-[0.16em] text-gray-500">
              Legal
            </p>
            <ul className="mt-3 space-y-2.5 text-sm text-gray-400">
              <li>
                <Link href="/terms" className="transition hover:text-white">
                  Terms
                </Link>
              </li>
              <li>
                <Link href="/privacy" className="transition hover:text-white">
                  Privacy
                </Link>
              </li>
            </ul>
          </div>

          <div>
            <p className="text-xs font-medium uppercase tracking-[0.16em] text-gray-500">
              Contact
            </p>
            <ul className="mt-3 space-y-2.5 text-sm text-gray-400">
              <li>
                <a
                  href={`mailto:${CONTACT_EMAIL}`}
                  className="transition hover:text-cyan-300"
                >
                  {CONTACT_EMAIL}
                </a>
              </li>
            </ul>
          </div>
        </div>
      </div>

      <div className="border-t border-white/5">
        <div className="mx-auto flex max-w-6xl flex-col gap-2 px-5 py-5 text-xs text-gray-600 md:flex-row md:items-center md:justify-between md:px-8">
          <p>© {year} OwnCover. All rights reserved.</p>
          <p>Built to keep your warranties safe.</p>
        </div>
      </div>
    </footer>
  );
}
