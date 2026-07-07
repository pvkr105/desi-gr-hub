import { createBrowserClient } from "@supabase/ssr";

// Browser Supabase client for Client Components. Reads the public env vars
// (anon key — safe to ship; RLS enforces access).
export function createClient() {
  return createBrowserClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
  );
}
