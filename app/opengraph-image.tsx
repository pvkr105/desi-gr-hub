import { ImageResponse } from "next/og";

// Site-wide Open Graph / WhatsApp preview image, generated at build time.
export const alt = "Desi GR Hub: Indian & South Asian Community in Grand Rapids, MI";
export const size = { width: 1200, height: 630 };
export const contentType = "image/png";

// Brand mark (from public/desi-gr-hub-logo/logo-mark.svg), embedded as a data URI.
const mark =
  "data:image/svg+xml," +
  encodeURIComponent(
    `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 128 128"><defs><linearGradient id="g" x1="0" y1="0" x2="1" y2="1"><stop offset="0" stop-color="#FF8A00"/><stop offset="0.5" stop-color="#FF4D8D"/><stop offset="1" stop-color="#8B5CF6"/></linearGradient></defs><line x1="64" y1="64" x2="37" y2="37" stroke="#FF8A00" stroke-width="4.5"/><line x1="64" y1="64" x2="91" y2="37" stroke="#FF4D8D" stroke-width="4.5"/><line x1="64" y1="64" x2="37" y2="91" stroke="#FF4D8D" stroke-width="4.5"/><line x1="64" y1="64" x2="91" y2="91" stroke="#8B5CF6" stroke-width="4.5"/><circle cx="64" cy="64" r="17" fill="url(#g)"/><circle cx="37" cy="37" r="10" fill="#FF8A00"/><circle cx="91" cy="37" r="10" fill="#FF4D8D"/><circle cx="37" cy="91" r="10" fill="#FF4D8D"/><circle cx="91" cy="91" r="10" fill="#8B5CF6"/></svg>`,
  );

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
            "radial-gradient(60% 80% at 10% 0%, rgba(255,138,0,0.35), transparent), radial-gradient(60% 80% at 100% 100%, rgba(139,92,246,0.4), transparent)",
          color: "#f4f4f8",
          fontFamily: "sans-serif",
        }}
      >
        <div style={{ display: "flex", alignItems: "center", gap: 24, marginBottom: 24 }}>
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img src={mark} width={96} height={96} alt="" />
          <div style={{ display: "flex", fontSize: 34, color: "#9aa0b4" }}>
            Grand Rapids &amp; West Michigan
          </div>
        </div>
        <div style={{ display: "flex", fontSize: 76, fontWeight: 700, lineHeight: 1.1 }}>
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
