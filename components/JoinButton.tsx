import Link from "next/link";

type Props = {
  href: string;
  children?: React.ReactNode;
  /** Full-width on its own line. */
  full?: boolean;
  className?: string;
};

// WhatsApp-green CTA. Used ONLY for joining groups/community so it's instantly
// recognizable. External WhatsApp links open the app directly.
export function JoinButton({ href, children = "Join Community", full, className = "" }: Props) {
  const external = href.startsWith("http");
  return (
    <Link
      href={href}
      {...(external ? { target: "_blank", rel: "noopener noreferrer" } : {})}
      className={`inline-flex min-h-11 items-center justify-center gap-2 rounded-full bg-wa px-5 py-2.5 text-sm font-semibold text-black transition-transform hover:bg-wa-dark active:scale-[0.98] ${
        full ? "w-full" : ""
      } ${className}`}
    >
      <svg aria-hidden="true" viewBox="0 0 24 24" className="h-4 w-4 fill-current">
        <path d="M12.04 2C6.58 2 2.13 6.45 2.13 11.91c0 1.75.46 3.45 1.32 4.95L2 22l5.25-1.38a9.9 9.9 0 0 0 4.79 1.22h.01c5.46 0 9.91-4.45 9.91-9.91 0-2.65-1.03-5.14-2.9-7.01A9.82 9.82 0 0 0 12.04 2Zm5.8 14.14c-.25.69-1.43 1.32-1.97 1.4-.5.08-1.15.11-1.85-.12-.43-.14-.98-.32-1.68-.62-2.96-1.28-4.9-4.26-5.05-4.46-.15-.2-1.2-1.6-1.2-3.05 0-1.45.76-2.16 1.03-2.46.27-.3.59-.37.79-.37.2 0 .39.002.56.01.18.008.42-.07.66.5.25.59.84 2.04.91 2.19.07.15.12.32.02.52-.1.2-.15.32-.3.5-.15.17-.31.39-.44.52-.15.15-.3.31-.13.6.17.3.76 1.25 1.63 2.02 1.12.99 2.06 1.3 2.36 1.45.3.15.47.12.65-.07.17-.2.75-.87.95-1.17.2-.3.4-.25.66-.15.27.1 1.7.8 1.99.95.3.15.5.22.56.35.07.12.07.7-.18 1.4Z" />
      </svg>
      {children}
    </Link>
  );
}
