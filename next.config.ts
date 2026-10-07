import path from "node:path";
import { fileURLToPath } from "node:url";
import type { NextConfig } from "next";

const projectRoot = path.dirname(fileURLToPath(import.meta.url));

const securityHeaders = [
  { key: "X-Content-Type-Options", value: "nosniff" },
  { key: "X-Frame-Options", value: "DENY" },
  { key: "Referrer-Policy", value: "strict-origin-when-cross-origin" },
  {
    key: "Permissions-Policy",
    value: "camera=(self), microphone=(), geolocation=()",
  },
];

// Baseline CSP: blocks framing, plugins, and <base> hijacking. Script/connect
// sources stay open because Google sign-in, UploadThing, and Tesseract's CDN
// assets all load from third-party origins.
const contentSecurityPolicy = [
  "frame-ancestors 'none'",
  "base-uri 'self'",
  "object-src 'none'",
];

if (process.env.NODE_ENV === "production") {
  contentSecurityPolicy.push("upgrade-insecure-requests");
  securityHeaders.push({
    key: "Strict-Transport-Security",
    value: "max-age=63072000; includeSubDomains; preload",
  });
}

securityHeaders.push({
  key: "Content-Security-Policy",
  value: contentSecurityPolicy.join("; "),
});

const nextConfig: NextConfig = {
  experimental: {
    optimizePackageImports: ["lucide-react", "date-fns", "framer-motion"],
  },
  // Pin the workspace root so Turbopack does not infer `src/app` and fail
  // HMR with "Next.js package not found".
  turbopack: {
    root: projectRoot,
  },
  outputFileTracingRoot: projectRoot,
  outputFileTracingIncludes: {
    "/api/ocr": ["./node_modules/tesseract.js/**/*"],
    "/api/inbound/resend": ["./node_modules/tesseract.js/**/*"],
  },
  poweredByHeader: false,
  serverExternalPackages: [
    "@prisma/client",
    "prisma",
    "pdf-parse",
    "tesseract.js",
    "sharp",
    "pdf-lib",
    "web-push",
    "resend",
  ],
  images: {
    remotePatterns: [
      {
        protocol: "https",
        hostname: "*.ufs.sh",
      },
      {
        protocol: "https",
        hostname: "utfs.io",
      },
    ],
  },
  async headers() {
    return [
      {
        source: "/:path*",
        headers: securityHeaders,
      },
    ];
  },
};

export default nextConfig;
