import Link from "next/link";
import { groups } from "@/data/groups";
import { footerDisclaimer } from "@/data/safety";
import { site } from "@/data/site";
import { LogoMark } from "./LogoMark";

const pageLinks = [
  { href: "/community", label: "Community Board" },
  { href: "/groups", label: "All Groups" },
  { href: "/events", label: "Events & Meetups" },
  { href: "/newcomers", label: "Newcomer's Guide" },
  { href: "/businesses", label: "Business Directory" },
  { href: "/currency", label: "Currency Converter" },
  { href: "/faq", label: "FAQ" },
  { href: "/guidelines", label: "Guidelines" },
  { href: "/safety", label: "Safety & Disclaimers" },
  { href: "/announcements", label: "Announcements" },
  { href: "/contact", label: "Contact" },
];

export function Footer() {
  return (
    <footer className="border-t border-line px-4 py-10 sm:px-6">
      <div className="mx-auto grid w-full max-w-5xl gap-8 sm:grid-cols-3">
        <div>
          <p className="flex items-center gap-2 font-display text-lg font-extrabold">
            <LogoMark className="h-6 w-6 shrink-0" />
            <span className="gradient-text">Desi GR Hub</span>
          </p>
          <p className="mt-2 text-sm text-muted">
            The Indian &amp; South Asian community in Grand Rapids &amp; West Michigan.
          </p>
        </div>
        <nav aria-label="Groups">
          <p className="text-sm font-semibold text-ink">Groups</p>
          <ul className="mt-2 space-y-1.5">
            {groups.map((g) => (
              <li key={g.slug}>
                <Link
                  href={`/groups/${g.slug}`}
                  className="text-sm text-muted transition-colors hover:text-saffron"
                >
                  {g.emoji} {g.name}
                </Link>
              </li>
            ))}
          </ul>
        </nav>
        <nav aria-label="Pages">
          <p className="text-sm font-semibold text-ink">Explore</p>
          <ul className="mt-2 space-y-1.5">
            {pageLinks.map((l) => (
              <li key={l.href}>
                <Link
                  href={l.href}
                  className="text-sm text-muted transition-colors hover:text-saffron"
                >
                  {l.label}
                </Link>
              </li>
            ))}
          </ul>
        </nav>
      </div>
      <div className="mx-auto mt-8 w-full max-w-5xl border-t border-line pt-6">
        <p className="text-xs leading-relaxed text-muted">{footerDisclaimer}</p>
        <p className="mt-3 text-xs text-muted">
          © {new Date().getFullYear()} {site.name}. Community-run.
        </p>
      </div>
    </footer>
  );
}
