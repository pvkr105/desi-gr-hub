"use client";

import { useState } from "react";
import Link from "next/link";
import { JoinButton } from "./JoinButton";
import { LogoMark } from "./LogoMark";
import { AuthNav } from "./AuthNav";
import { site } from "@/data/site";

// Primary nav shown in the header. Full set lives in the footer.
const navLinks = [
  { href: "/community", label: "Community Board" },
  { href: "/groups", label: "Groups" },
  { href: "/events", label: "Events" },
  { href: "/newcomers", label: "Newcomers" },
  { href: "/contact", label: "Contact" },
];

export function Header() {
  const [open, setOpen] = useState(false);

  return (
    <header className="glass sticky top-0 z-50 border-b">
      <div className="mx-auto flex w-full max-w-5xl items-center justify-between px-4 py-3 sm:px-6">
        <Link
          href="/"
          className="flex items-center gap-2 text-lg font-extrabold font-display tracking-tight"
          onClick={() => setOpen(false)}
        >
          <LogoMark className="h-7 w-7 shrink-0" />
          <span className="gradient-text">Desi GR Hub</span>
        </Link>

        <nav className="hidden items-center gap-6 md:flex" aria-label="Primary">
          {navLinks.map((l) => (
            <Link key={l.href} href={l.href} className="text-sm text-muted hover:text-ink">
              {l.label}
            </Link>
          ))}
          <JoinButton href={site.mainHubUrl}>Join</JoinButton>
          <AuthNav />
        </nav>

        <button
          type="button"
          onClick={() => setOpen((v) => !v)}
          className="inline-flex h-11 w-11 items-center justify-center rounded-lg md:hidden"
          aria-label={open ? "Close menu" : "Open menu"}
          aria-expanded={open}
        >
          <svg viewBox="0 0 24 24" className="h-6 w-6 stroke-current" fill="none" strokeWidth={2}>
            {open ? (
              <path d="M6 6l12 12M18 6L6 18" strokeLinecap="round" />
            ) : (
              <path d="M4 7h16M4 12h16M4 17h16" strokeLinecap="round" />
            )}
          </svg>
        </button>
      </div>

      {open && (
        <nav className="border-t border-line px-4 py-2 md:hidden" aria-label="Mobile">
          {navLinks.map((l) => (
            <Link
              key={l.href}
              href={l.href}
              onClick={() => setOpen(false)}
              className="block min-h-11 py-2.5 text-base text-muted hover:text-ink"
            >
              {l.label}
            </Link>
          ))}
          <div className="mt-2 border-t border-line pt-3" onClick={(e) => { if (e.target === e.currentTarget) setOpen(false); }}>
            <AuthNav onNavigate={() => setOpen(false)} />
          </div>
        </nav>
      )}
    </header>
  );
}
