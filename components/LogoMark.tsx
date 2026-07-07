// Brand mark (the "community network" glyph from public/desi-gr-hub-logo/).
// Inlined as a component so it needs no network request and carries its own
// unique gradient id (safe to render multiple times per page).
export function LogoMark({ className }: { className?: string }) {
  return (
    <svg
      viewBox="0 0 128 128"
      className={className}
      role="img"
      aria-label="Desi GR Hub"
      xmlns="http://www.w3.org/2000/svg"
    >
      <defs>
        <linearGradient id="dgh-mark" x1="0" y1="0" x2="1" y2="1">
          <stop offset="0" stopColor="#FF8A00" />
          <stop offset="0.5" stopColor="#FF4D8D" />
          <stop offset="1" stopColor="#8B5CF6" />
        </linearGradient>
      </defs>
      <line x1="64" y1="64" x2="37" y2="37" stroke="#FF8A00" strokeWidth="4.5" />
      <line x1="64" y1="64" x2="91" y2="37" stroke="#FF4D8D" strokeWidth="4.5" />
      <line x1="64" y1="64" x2="37" y2="91" stroke="#FF4D8D" strokeWidth="4.5" />
      <line x1="64" y1="64" x2="91" y2="91" stroke="#8B5CF6" strokeWidth="4.5" />
      <circle cx="64" cy="64" r="17" fill="url(#dgh-mark)" />
      <circle cx="37" cy="37" r="10" fill="#FF8A00" />
      <circle cx="91" cy="37" r="10" fill="#FF4D8D" />
      <circle cx="37" cy="91" r="10" fill="#FF4D8D" />
      <circle cx="91" cy="91" r="10" fill="#8B5CF6" />
    </svg>
  );
}
