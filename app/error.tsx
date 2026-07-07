"use client";

import Link from "next/link";

// Route-level error boundary — shown when a page or server action throws
// (e.g. the database is unreachable). Next logs the digest server-side.
export default function Error({
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  return (
    <div className="glass mx-auto mt-16 max-w-md rounded-2xl p-8 text-center">
      <h2 className="font-display text-xl font-bold">Something went wrong</h2>
      <p className="mt-2 text-sm text-muted">
        It&apos;s probably temporary. Try again, or head back home.
      </p>
      <div className="mt-5 flex justify-center gap-3">
        <button
          type="button"
          onClick={reset}
          className="inline-flex min-h-11 items-center rounded-full border border-line px-5 text-sm font-medium hover:border-saffron"
        >
          Try again
        </button>
        <Link
          href="/"
          className="inline-flex min-h-11 items-center rounded-full border border-line px-5 text-sm font-medium hover:border-saffron"
        >
          Home
        </Link>
      </div>
    </div>
  );
}
