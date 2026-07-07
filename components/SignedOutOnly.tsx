"use client";

import { useEffect, useState } from "react";
import { createClient } from "@/lib/supabase/client";

// Renders children only for signed-out visitors. Mirrors the AuthNav island:
// resolves the user client-side so marketing pages stay static. Nothing renders
// until auth is known, so there's no flash of the signed-out content.
export function SignedOutOnly({ children }: { children: React.ReactNode }) {
  // No Supabase configured → board is anonymous; always show.
  if (!process.env.NEXT_PUBLIC_SUPABASE_URL) return <>{children}</>;
  return <Gate>{children}</Gate>;
}

function Gate({ children }: { children: React.ReactNode }) {
  const [signedIn, setSignedIn] = useState<boolean | null>(null);

  useEffect(() => {
    const supabase = createClient();
    supabase.auth.getUser().then(({ data }) => setSignedIn(!!data.user));
    const { data: sub } = supabase.auth.onAuthStateChange((_e, session) => {
      setSignedIn(!!session?.user);
    });
    return () => sub.subscription.unsubscribe();
  }, []);

  if (signedIn !== false) return null; // unknown or signed in → render nothing
  return <>{children}</>;
}
