"use client";

import { useState } from "react";
import Link from "next/link";
import { Menu, X } from "lucide-react";

import BrandLogo from "@/components/brand-logo";
import { useHasAuthSession } from "@/components/use-has-auth-session";
import { BRAND_TAGLINE } from "@/constants/brand";

const NAV = [
  { href: "/#how-it-works", label: "How it works" },
  { href: "/help", label: "Help" },
  { href: "/pricing", label: "Pricing" },
  { href: "/about", label: "About" },
] as const;

export default function MarketingHeader() {
  const [mobileOpen, setMobileOpen] = useState(false);
  const signedIn = useHasAuthSession();
  const homeHref = signedIn ? "/dashboard" : "/";

  return (
    <header className="site-header sticky top-0 z-50">
      <div className="mx-auto flex max-w-6xl items-center justify-between px-5 py-4 md:px-8">
        <Link href={homeHref} className="inline-flex items-center gap-3">
          <BrandLogo variant="full" size="md" tagline={BRAND_TAGLINE} />
        </Link>

        <nav className="hidden items-center gap-7 md:flex">
          {NAV.map((item) => (
            <Link
              key={item.href}
              href={item.href}
              className="text-sm text-gray-400 transition-colors duration-200 hover:text-white"
            >
              {item.label}
            </Link>
          ))}
          {signedIn === null ? (
            <span
              className="h-9 w-28 rounded-xl bg-white/10"
              aria-hidden
            />
          ) : signedIn ? (
            <Link
              href="/dashboard"
              className="premium-btn premium-btn-solid rounded-xl bg-white px-4 py-2 text-sm font-semibold text-black"
            >
              Dashboard
            </Link>
          ) : (
            <>
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
            </>
          )}
        </nav>

        <button
          type="button"
          className="premium-ghost rounded-xl border border-white/10 p-2 md:hidden"
          onClick={() => setMobileOpen((v) => !v)}
          aria-label={mobileOpen ? "Close menu" : "Open menu"}
          aria-expanded={mobileOpen}
        >
          {mobileOpen ? <X size={18} /> : <Menu size={18} />}
        </button>
      </div>

      {mobileOpen && (
        <div className="border-t border-white/10 px-5 py-3 md:hidden">
          <div className="flex flex-col gap-1">
            {NAV.map((item) => (
              <Link
                key={item.href}
                href={item.href}
                onClick={() => {
                  window.setTimeout(() => setMobileOpen(false), 0);
                }}
                className="rounded-xl px-3 py-2.5 text-sm text-gray-300"
              >
                {item.label}
              </Link>
            ))}
            {signedIn === null ? (
              <div className="h-10 rounded-xl bg-white/10" aria-hidden />
            ) : signedIn ? (
              <Link
                href="/dashboard"
                onClick={() => {
                  window.setTimeout(() => setMobileOpen(false), 0);
                }}
                className="premium-btn premium-btn-solid rounded-xl bg-white px-3 py-2.5 text-center text-sm font-semibold text-black"
              >
                Dashboard
              </Link>
            ) : (
              <>
                <Link
                  href="/login"
                  onClick={() => {
                    window.setTimeout(() => setMobileOpen(false), 0);
                  }}
                  className="rounded-xl px-3 py-2.5 text-sm text-gray-300"
                >
                  Sign in
                </Link>
                <Link
                  href="/register"
                  onClick={() => {
                    window.setTimeout(() => setMobileOpen(false), 0);
                  }}
                  className="premium-btn premium-btn-solid rounded-xl bg-white px-3 py-2.5 text-center text-sm font-semibold text-black"
                >
                  Get started
                </Link>
              </>
            )}
          </div>
        </div>
      )}
    </header>
  );
}
