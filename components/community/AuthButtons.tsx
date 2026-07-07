"use client";

import { useState } from "react";
import { createClient } from "@/lib/supabase/client";

// Sign-in options for the community board: Google OAuth + email magic link.
// Both route back through /auth/callback which finishes the session.
export function AuthButtons({ next }: { next?: string }) {
  const supabase = createClient();
  const [email, setEmail] = useState("");
  const [loading, setLoading] = useState(false);
  const [sent, setSent] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const callback = (n: string) =>
    `${window.location.origin}/auth/callback?next=${encodeURIComponent(n)}`;

  async function google() {
    setError(null);
    await supabase.auth.signInWithOAuth({
      provider: "google",
      options: { redirectTo: callback(next ?? "/community") },
    });
  }

  async function magicLink(e: React.FormEvent) {
    e.preventDefault();
    setLoading(true);
    setError(null);
    const { error } = await supabase.auth.signInWithOtp({
      email,
      options: { emailRedirectTo: callback(next ?? "/community") },
    });
    setLoading(false);
    if (error) setError("Could not send the link. Check the address and try again.");
    else setSent(true);
  }

  return (
    <div className="flex flex-col gap-4">
      <button
        type="button"
        onClick={google}
        className="inline-flex min-h-11 items-center justify-center gap-2 rounded-full border border-line px-5 text-sm font-semibold hover:border-saffron"
      >
        <svg aria-hidden="true" viewBox="0 0 24 24" className="h-4 w-4">
          <path
            fill="#4285F4"
            d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92a5.06 5.06 0 0 1-2.2 3.32v2.77h3.57c2.08-1.92 3.27-4.74 3.27-8.1Z"
          />
          <path
            fill="#34A853"
            d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84A11 11 0 0 0 12 23Z"
          />
          <path
            fill="#FBBC05"
            d="M5.84 14.1a6.6 6.6 0 0 1 0-4.2V7.06H2.18a11 11 0 0 0 0 9.88l3.66-2.84Z"
          />
          <path
            fill="#EA4335"
            d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1A11 11 0 0 0 2.18 7.06l3.66 2.84C6.71 7.3 9.14 5.38 12 5.38Z"
          />
        </svg>
        Continue with Google
      </button>

      <div className="flex items-center gap-3 text-xs text-muted">
        <span className="h-px flex-1 bg-line" />
        or
        <span className="h-px flex-1 bg-line" />
      </div>

      {sent ? (
        <p className="glass rounded-2xl p-4 text-sm text-muted">
          Check your inbox for a sign-in link.
        </p>
      ) : (
        <form onSubmit={magicLink} className="flex flex-col gap-3">
          <label htmlFor="auth-email" className="text-sm font-medium">
            Email a sign-in link
          </label>
          <input
            id="auth-email"
            type="email"
            required
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder="you@example.com"
            className="min-h-11 rounded-xl border border-line bg-bg-soft px-4 text-sm"
          />
          <button
            type="submit"
            disabled={loading}
            className="inline-flex min-h-11 items-center justify-center rounded-full border border-line px-5 text-sm font-semibold hover:border-saffron disabled:opacity-60"
          >
            {loading ? "Sending…" : "Send link"}
          </button>
          {error && <p className="text-sm text-magenta">{error}</p>}
        </form>
      )}
    </div>
  );
}
