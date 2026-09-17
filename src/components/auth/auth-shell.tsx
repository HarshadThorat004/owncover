import type { ReactNode } from "react";
import Image from "next/image";
import Link from "next/link";
import { ChevronLeft } from "lucide-react";

import BrandLogo from "@/components/brand-logo";
import { BRAND_TAGLINE } from "@/constants/brand";

export const authInputClass =
  "w-full rounded-[10px] border border-white/15 bg-transparent px-3.5 py-2.5 text-sm text-white outline-none transition placeholder:text-white/30 focus:border-white/35 focus:shadow-[0_0_0_3px_rgba(34,211,238,0.12)]";

export const authPrimaryButtonClass =
  "premium-btn premium-btn-solid inline-flex w-full items-center justify-center rounded-[10px] bg-white py-2.5 text-sm font-medium text-black disabled:cursor-not-allowed disabled:bg-white/10 disabled:text-white/35";

export const authSecondaryButtonClass =
  "premium-ghost inline-flex w-full items-center justify-center gap-2 rounded-[10px] border border-white/15 bg-transparent px-3 py-2.5 text-sm font-medium text-white disabled:opacity-50";

function AuthBackground() {
  return (
    <div className="pointer-events-none absolute inset-0 overflow-hidden" aria-hidden>
      <div className="absolute inset-0 bg-[#050505]" />
      <div
        className="absolute -left-[20%] bottom-[-10%] h-[70%] w-[70%] opacity-40"
        style={{
          background:
            "radial-gradient(ellipse at 30% 70%, rgba(120,120,120,0.35) 0%, transparent 55%)",
          filter: "blur(40px)",
        }}
      />
      <div
        className="absolute -right-[15%] top-[-5%] h-[65%] w-[65%] opacity-45"
        style={{
          background:
            "radial-gradient(ellipse at 70% 20%, rgba(140,140,140,0.4) 0%, transparent 50%)",
          filter: "blur(50px)",
        }}
      />
      <div
        className="absolute inset-0 opacity-[0.18] mix-blend-overlay"
        style={{
          backgroundImage:
            "url(\"data:image/svg+xml,%3Csvg viewBox='0 0 256 256' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='n'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.85' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23n)'/%3E%3C/svg%3E\")",
          backgroundRepeat: "repeat",
          backgroundSize: "180px 180px",
        }}
      />
    </div>
  );
}

function AuthHeroPanel({ compact = false }: { compact?: boolean }) {
  return (
    <div
      className={`relative overflow-hidden bg-[#030304] ${
        compact ? "h-[180px] w-full shrink-0" : "h-full min-h-screen w-full"
      }`}
    >
      <Image
        src="/brand/auth-hero.png"
        alt=""
        fill
        priority
        sizes={compact ? "100vw" : "55vw"}
        className="object-cover object-center"
      />
      <div
        className="absolute inset-0"
        style={{
          background: compact
            ? "linear-gradient(to bottom, rgba(5,5,5,0.15) 0%, rgba(5,5,5,0.55) 70%, rgba(5,5,5,0.95) 100%)"
            : "linear-gradient(to right, rgba(5,5,5,0.2) 0%, rgba(5,5,5,0.35) 55%, rgba(5,5,5,0.85) 100%), linear-gradient(to top, rgba(5,5,5,0.75) 0%, transparent 45%)",
        }}
        aria-hidden
      />
      <div
        className={`absolute z-10 ${
          compact
            ? "bottom-4 left-5 right-5"
            : "bottom-10 left-10 right-10 max-w-md"
        }`}
      >
        {!compact && (
          <BrandLogo
            variant="full"
            size="md"
            tagline={false}
            className="mb-5"
          />
        )}
        <p
          className={`font-display tracking-tight text-white ${
            compact ? "text-lg" : "text-3xl leading-tight md:text-4xl"
          }`}
        >
          Walk in with facts.
        </p>
        {!compact && (
          <p className="mt-3 text-sm leading-7 text-white/55">
            GST invoices, cover dates, and a claim pack — ready before you reach
            the service desk.
          </p>
        )}
      </div>
    </div>
  );
}

export function AuthBrandMark({ className = "" }: { className?: string }) {
  return (
    <div className={`mx-auto w-fit ${className}`.trim()} aria-hidden>
      <BrandLogo variant="mark" size="md" />
    </div>
  );
}

type AuthShellProps = {
  children: ReactNode;
  /** Narrower max width for forms; wider for legal prose (no hero split) */
  wide?: boolean;
  showHomeLink?: boolean;
};

export default function AuthShell({
  children,
  wide = false,
  showHomeLink = true,
}: AuthShellProps) {
  if (wide) {
    return (
      <main className="relative min-h-screen overflow-hidden bg-[#050505] text-white">
        <AuthBackground />

        {showHomeLink && (
          <Link
            href="/"
            className="absolute left-5 top-5 z-20 inline-flex items-center gap-1 text-sm text-white/55 transition hover:text-white"
          >
            <ChevronLeft size={16} strokeWidth={1.75} />
            Home
          </Link>
        )}

        <div className="relative z-10 mx-auto flex min-h-screen max-w-3xl flex-col justify-center px-4 py-16">
          {children}
        </div>
      </main>
    );
  }

  return (
    <main className="relative min-h-screen bg-[#050505] text-white">
      <div className="flex min-h-screen flex-col md:grid md:grid-cols-[minmax(0,1.1fr)_minmax(0,0.9fr)]">
        <div className="relative hidden md:block">
          <AuthHeroPanel />
        </div>

        <div className="relative flex min-h-screen flex-col">
          <div className="md:hidden">
            <AuthHeroPanel compact />
          </div>

          <AuthBackground />

          <div className="relative z-10 flex flex-1 flex-col">
            <div className="flex items-center justify-between px-5 pt-5 md:px-8 md:pt-8">
              {showHomeLink ? (
                <Link
                  href="/"
                  className="inline-flex items-center gap-1 text-sm text-white/55 transition hover:text-white"
                >
                  <ChevronLeft size={16} strokeWidth={1.75} />
                  Home
                </Link>
              ) : (
                <span />
              )}
              <BrandLogo variant="full" size="sm" tagline={BRAND_TAGLINE} />
            </div>

            <div className="mx-auto flex w-full max-w-[400px] flex-1 flex-col justify-center px-5 py-10 md:px-8 md:py-14">
              {children}
            </div>
          </div>
        </div>
      </div>
    </main>
  );
}

type AuthLegalFooterProps = {
  action: "in" | "up";
};

export function AuthLegalFooter({ action }: AuthLegalFooterProps) {
  return (
    <p className="mt-8 text-center text-xs leading-5 text-white/40">
      By signing {action}, you agree to our{" "}
      <Link href="/terms" className="underline decoration-white/30 underline-offset-2 hover:text-white/70">
        Terms
      </Link>{" "}
      and{" "}
      <Link
        href="/privacy"
        className="underline decoration-white/30 underline-offset-2 hover:text-white/70"
      >
        Privacy Policy
      </Link>
      .
    </p>
  );
}
