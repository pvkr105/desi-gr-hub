import Link from "next/link";

// Subtle one-line prompt inviting contributions — shown near the bottom of the
// board and utility pages. Server component; no interactivity.
export function ContributeBanner() {
  return (
    <div className="glass mt-8 rounded-2xl p-5 text-sm text-muted">
      Have a suggestion or want to contribute?{" "}
      <Link
        href="/contact?category=suggestion"
        className="font-semibold text-saffron transition-colors hover:text-saffron/80"
      >
        Contact us
      </Link>
    </div>
  );
}
