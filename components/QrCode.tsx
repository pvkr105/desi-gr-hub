import QRCode from "qrcode";

// Build-time QR code: renders an SVG string on the server (no client JS, no
// client-side generation). Wrapped in a white card so it stays scannable on the
// dark theme.
export async function QrCode({ value, label }: { value: string; label?: string }) {
  const svg = await QRCode.toString(value, {
    type: "svg",
    margin: 1,
    errorCorrectionLevel: "M",
    color: { dark: "#0b0b12", light: "#ffffff" },
  });

  return (
    <figure className="flex flex-col items-center gap-2">
      <div
        className="h-40 w-40 rounded-xl bg-white p-2 [&>svg]:h-full [&>svg]:w-full"
        dangerouslySetInnerHTML={{ __html: svg }}
      />
      {label && <figcaption className="text-xs text-muted">{label}</figcaption>}
    </figure>
  );
}
