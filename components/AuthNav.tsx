"use client";

import { useEffect, useState } from "react";
import type { User } from "@supabase/supabase-js";
import Link from "next/link";
import { createClient } from "@/lib/supabase/client";
import { signOut } from "@/app/community/actions";

// Header auth island: shows "Hi, <name>" + Sign out when signed in, or a Sign in
// link otherwise. Client-side so the marketing pages stay static — only this chip
// hydrates. Mirrors the WeatherBanner / ForexIndicator island pattern.
function firstName(user: User | null): string | null {
  if (!user) return null;
  const m = (user.user_metadata ?? {}) as { full_name?: string; name?: string };
  const full = m.full_name || m.name;
  if (full) return String(full).split(" ")[0];
  return user.email?.split("@")[0] ?? "there";
}

export function AuthNav({ onNavigate }: { onNavigate?: () => void } = {}) {
  const [name, setName] = useState<string | null>(null);
  const [ready, setReady] = useState(false);

  useEffect(() => {
    if (!process.env.NEXT_PUBLIC_SUPABASE_URL) return; // board not configured
    const supabase = createClient();
    supabase.auth.getUser().then(({ data }) => {
      setName(firstName(data.user));
      setReady(true);
    });
    const { data: sub } = supabase.auth.onAuthStateChange((_event, session) => {
      setName(firstName(session?.user ?? null));
      setReady(true);
    });
    return () => sub.subscription.unsubscribe();
  }, []);

  // Nothing until we know, so the header never flashes the wrong state.
  if (!ready) return null;

  if (!name) {
    return (
      <Link
        href="/account"
        onClick={onNavigate}
        className="inline-flex min-h-11 items-center rounded-full border border-line px-4 text-sm font-medium hover:border-saffron"
      >
        Sign in
      </Link>
    );
  }

  return (
    <span className="inline-flex items-center gap-2">
      <span className="text-sm text-muted">
        Hi, <span className="font-semibold text-ink">{name}</span>
      </span>
      <form action={signOut} onSubmit={onNavigate}>
        <button
          type="submit"
          className="inline-flex min-h-11 items-center rounded-full border border-line px-4 text-sm font-medium text-muted hover:border-saffron hover:text-ink"
        >
          Sign out
        </button>
      </form>
    </span>
  );
}
