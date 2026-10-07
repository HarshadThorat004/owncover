import type { Metadata, Viewport } from "next";
import { Geist, Noto_Sans_Devanagari } from "next/font/google";

import "./globals.css";
import { Toaster } from "sonner";

import SupportChatRoot from "@/components/support-chat-root";
import {
  BRAND_DESCRIPTION,
  BRAND_NAME,
  BRAND_TITLE,
} from "@/constants/brand";
import { getAppBaseUrl } from "@/lib/app-url";
import { getGoogleSiteVerificationToken } from "@/lib/google-site-verification";
import { BRAND_KEYWORDS } from "@/lib/seo";

const geist = Geist({
  subsets: ["latin"],
  variable: "--font-geist",
});

const notoDevanagari = Noto_Sans_Devanagari({
  subsets: ["devanagari"],
  weight: ["400", "500", "600", "700"],
  variable: "--font-devanagari",
  display: "swap",
});

const appUrl = getAppBaseUrl();

const googleSiteVerification = getGoogleSiteVerificationToken();

export const viewport: Viewport = {
  themeColor: "#030304",
  colorScheme: "dark",
};

export const metadata: Metadata = {
  metadataBase: new URL(appUrl),
  title: {
    default: BRAND_TITLE,
    template: `%s — ${BRAND_NAME}`,
  },
  description: BRAND_DESCRIPTION,
  keywords: [...BRAND_KEYWORDS],
  applicationName: BRAND_NAME,
  authors: [{ name: BRAND_NAME, url: appUrl }],
  creator: BRAND_NAME,
  publisher: BRAND_NAME,
  category: "technology",
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      "max-image-preview": "large",
      "max-snippet": -1,
    },
  },
  manifest: "/manifest.webmanifest",
  appleWebApp: {
    capable: true,
    title: BRAND_NAME,
    statusBarStyle: "black-translucent",
  },
  openGraph: {
    type: "website",
    locale: "en_IN",
    url: appUrl,
    siteName: BRAND_NAME,
    title: BRAND_TITLE,
    description: BRAND_DESCRIPTION,
  },
  twitter: {
    card: "summary_large_image",
    title: BRAND_TITLE,
    description: BRAND_DESCRIPTION,
  },
  icons: {
    icon: [
      { url: "/brand/favicon.svg", type: "image/svg+xml" },
      { url: "/brand/logo-mark.svg", type: "image/svg+xml", sizes: "any" },
    ],
    apple: [{ url: "/brand/apple-touch-icon.png", sizes: "180x180" }],
  },
  ...(googleSiteVerification
    ? {
        verification: {
          google: googleSiteVerification,
        },
      }
    : {}),
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const googleVerification = getGoogleSiteVerificationToken();

  return (
    <html lang="en" data-scroll-behavior="smooth">
      <head>
        {googleVerification ? (
          <meta
            name="google-site-verification"
            content={googleVerification}
          />
        ) : null}
      </head>
      <body
        className={`${geist.variable} ${notoDevanagari.variable} ${geist.className} antialiased bg-[#030304] text-white`}
      >
        <SupportChatRoot>{children}</SupportChatRoot>
        <Toaster
          position="top-right"
          richColors
          closeButton
          duration={3000}
          theme="dark"
        />
      </body>
    </html>
  );
}
