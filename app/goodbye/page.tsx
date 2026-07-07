import type { Metadata } from "next";
import Link from "next/link";

export const metadata: Metadata = {
  title: "Signed out",
  robots: { index: false },
};

export default function GoodbyePage() {
  return (
    <>
      {/* No JS needed — meta refresh sends them home after ~3s. */}
      <meta httpEquiv="refresh" content="3; url=/" />
      <section className="py-16">
        <div className="glass mx-auto max-w-md rounded-2xl p-8 text-center">
          <p className="font-display text-xl font-bold">
            You&apos;re signed out — thanks for being part of Desi GR Hub 🙏
          </p>
          <p className="mt-3 text-sm text-muted">Redirecting you home…</p>
          <Link
            href="/"
            className="mt-6 inline-flex min-h-11 items-center rounded-full border border-line px-5 text-sm font-medium transition-colors hover:border-saffron hover:text-saffron"
          >
            Go home now
          </Link>
        </div>
      </section>
    </>
  );
}
