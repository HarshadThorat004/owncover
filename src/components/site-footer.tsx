"use client";

import Link from "next/link";

import BrandLogo from "@/components/brand-logo";
import { useHasAuthSession } from "@/components/use-has-auth-session";
import { BRAND_CONTACT_EMAIL, BRAND_NAME, BRAND_TAGLINE } from "@/constants/brand";

const CONTACT_EMAIL = BRAND_CONTACT_EMAIL;

const PRODUCT_LINKS = [
  { href: "/#how-it-works", label: "How it works" },
  { href: "/help", label: "Help" },
  { href: "/help/hi", label: "मदद" },
  { href: "/#compare", label: "Compare" },
  { href: "/sample-pack", label: "Sample pack" },
  { href: "/pricing", label: "Pricing" },
  { href: "/#faq", label: "FAQ" },
  { href: "/register", label: "Get started" },
  { href: "/login", label: "Sign in" },
] as const;

const COMPANY_LINKS = [
  { href: "/about", label: "About" },
  { href: "/security", label: "Security" },
  { href: "/contact", label: "Contact" },
] as const;

const LEGAL_LINKS = [
  { href: "/terms", label: "Terms" },
  { href: "/privacy", label: "Privacy" },
] as const;

export default function SiteFooter() {
  const signedIn = useHasAuthSession();
  const year = new Date().getFullYear();
  const productLinks = signedIn
    ? [
        ...PRODUCT_LINKS.filter(
          (item) => item.href !== "/login" && item.href !== "/register"
        ),
        { href: "/dashboard", label: "Dashboard" } as const,
      ]
    : PRODUCT_LINKS;

  return (
    <footer className="relative border-t border-white/10 bg-[#030304]/80">
      <div className="mx-auto flex max-w-6xl flex-col gap-8 px-5 py-10 md:flex-row md:items-start md:justify-between md:px-8 md:py-12">
        <div className="max-w-sm">
          <BrandLogo variant="full" size="sm" tagline={BRAND_TAGLINE} />
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
              {productLinks.map((item) => (
                <li key={item.href}>
                  <Link href={item.href} className="transition hover:text-white">
                    {item.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          <div>
            <p className="text-xs font-medium uppercase tracking-[0.16em] text-gray-500">
              Company
            </p>
            <ul className="mt-3 space-y-2.5 text-sm text-gray-400">
              {COMPANY_LINKS.map((item) => (
                <li key={item.href}>
                  <Link href={item.href} className="transition hover:text-white">
                    {item.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          <div>
            <p className="text-xs font-medium uppercase tracking-[0.16em] text-gray-500">
              Legal
            </p>
            <ul className="mt-3 space-y-2.5 text-sm text-gray-400">
              {LEGAL_LINKS.map((item) => (
                <li key={item.href}>
                  <Link href={item.href} className="transition hover:text-white">
                    {item.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          <div>
            <p className="text-xs font-medium uppercase tracking-[0.16em] text-gray-500">
              Contact
            </p>
            <ul className="mt-3 space-y-2.5 text-sm text-gray-400">
              <li>
                <Link href="/contact" className="transition hover:text-white">
                  Write to us
                </Link>
              </li>
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
          <p>
            © {year} {BRAND_NAME}. All rights reserved.
          </p>
          <p>{BRAND_TAGLINE}</p>
        </div>
      </div>
    </footer>
  );
}
