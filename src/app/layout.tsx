import type { Metadata, Viewport } from "next";
import { Geist } from "next/font/google";

import "./globals.css";
import { Toaster } from "sonner";
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
    apple: [{ url: "/brand/logo-mark.svg" }],
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
    <html lang="en">
      <head>
        {googleVerification ? (
          <meta
            name="google-site-verification"
            content={googleVerification}
          />
        ) : null}
      </head>
      <body
        className={`${geist.variable} ${geist.className} antialiased bg-[#030304] text-white`}
      >
        {children}
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
