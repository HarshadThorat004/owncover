"use client";

import { BRAND_CONTACT_EMAIL, BRAND_NAME } from "@/constants/brand";

type Props = {
  error: Error & { digest?: string };
  reset: () => void;
};

export default function GlobalError({ error, reset }: Props) {
  console.error(error);

  return (
    <html lang="en">
      <body
        style={{
          margin: 0,
          minHeight: "100vh",
          background: "#030304",
          color: "#f5f5f5",
          fontFamily: "system-ui, sans-serif",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          padding: 24,
        }}
      >
        <main style={{ maxWidth: 420, textAlign: "center" }}>
          <p
            style={{
              letterSpacing: "0.16em",
              fontSize: 11,
              color: "#6b7280",
              textTransform: "uppercase",
            }}
          >
            {BRAND_NAME}
          </p>
          <h1 style={{ fontSize: 32, fontWeight: 500, margin: "16px 0 12px" }}>
            Something broke on our side.
          </h1>
          <p style={{ color: "#9ca3af", lineHeight: 1.6, fontSize: 14 }}>
            Try again. If it keeps happening, email {BRAND_CONTACT_EMAIL}.
          </p>
          <button
            type="button"
            onClick={reset}
            style={{
              marginTop: 24,
              background: "#fff",
              color: "#000",
              border: 0,
              borderRadius: 12,
              padding: "12px 20px",
              fontWeight: 600,
              cursor: "pointer",
            }}
          >
            Try again
          </button>
        </main>
      </body>
    </html>
  );
}
