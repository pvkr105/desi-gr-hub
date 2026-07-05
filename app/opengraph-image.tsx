import { ImageResponse } from "next/og";

// Site-wide Open Graph / WhatsApp preview image, generated at build time.
export const alt = "Desi GR Hub: Indian & South Asian Community in Grand Rapids, MI";
export const size = { width: 1200, height: 630 };
export const contentType = "image/png";

export default function Image() {
  return new ImageResponse(
    (
      <div
        style={{
          width: "100%",
          height: "100%",
          display: "flex",
          flexDirection: "column",
          justifyContent: "center",
          padding: "80px",
          background: "#0b0b12",
          backgroundImage:
            "radial-gradient(60% 80% at 10% 0%, rgba(255,138,61,0.35), transparent), radial-gradient(60% 80% at 100% 100%, rgba(168,85,247,0.4), transparent)",
          color: "#f5f3ff",
          fontFamily: "sans-serif",
        }}
      >
        <div style={{ display: "flex", fontSize: 34, color: "#a6a3b8", marginBottom: 24 }}>
          Grand Rapids &amp; West Michigan
        </div>
        <div style={{ display: "flex", fontSize: 76, fontWeight: 800, lineHeight: 1.1 }}>
          Desi GR Hub
        </div>
        <div style={{ display: "flex", fontSize: 40, marginTop: 20, maxWidth: 900, color: "#dcd8f0" }}>
          The Indian &amp; South Asian community in Grand Rapids, Michigan
        </div>
        <div style={{ display: "flex", fontSize: 30, marginTop: 40, color: "#25d366", fontWeight: 700 }}>
          Rides · Housing · Marketplace · Q&amp;A, free on WhatsApp
        </div>
      </div>
    ),
    { ...size }
  );
}
