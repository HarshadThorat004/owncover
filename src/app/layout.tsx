import type { Metadata } from "next";
import { Geist } from "next/font/google";

import "./globals.css";
import { Toaster } from "sonner";
import { getAppBaseUrl } from "@/lib/app-url";

const geist = Geist({
  subsets: ["latin"],
  variable: "--font-inter",
});

export const metadata: Metadata = {
  metadataBase: new URL(getAppBaseUrl()),
  title: "OwnCover",
  description: "Track your product warranties easily",
  applicationName: "OwnCover",
  manifest: "/manifest.webmanifest",
  appleWebApp: {
    capable: true,
    title: "OwnCover",
    statusBarStyle: "black-translucent",
  },
  icons: {
    icon: [
      { url: "/brand/favicon.svg", type: "image/svg+xml" },
      { url: "/brand/logo-mark.svg", type: "image/svg+xml", sizes: "any" },
    ],
    apple: [{ url: "/brand/logo-mark.svg" }],
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
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
