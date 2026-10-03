import { ImageResponse } from "next/og";

import { BRAND_NAME, BRAND_TAGLINE } from "@/constants/brand";

export const alt = `${BRAND_NAME} — ${BRAND_TAGLINE}`;
export const size = { width: 1200, height: 630 };
export const contentType = "image/png";

export default function OpenGraphImage() {
  return new ImageResponse(
    (
      <div
        style={{
          width: "100%",
          height: "100%",
          display: "flex",
          flexDirection: "column",
          justifyContent: "space-between",
          background: "#030304",
          padding: "72px 80px",
          color: "#f5f5f5",
        }}
      >
        <div
          style={{
            display: "flex",
            alignItems: "center",
            gap: 16,
            fontSize: 22,
            letterSpacing: 4,
            textTransform: "uppercase",
            color: "#22d3ee",
          }}
        >
          {BRAND_NAME}
        </div>
        <div style={{ display: "flex", flexDirection: "column", gap: 20 }}>
          <div
            style={{
              fontSize: 64,
              lineHeight: 1.08,
              letterSpacing: -2,
              fontWeight: 500,
              maxWidth: 900,
            }}
          >
            Every bill. Every cover date.
          </div>
          <div style={{ fontSize: 28, color: "#9ca3af" }}>{BRAND_TAGLINE}</div>
        </div>
      </div>
    ),
    { ...size }
  );
}
