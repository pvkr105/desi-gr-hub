import { NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";

// OAuth / magic-link callback: exchanges the auth code for a session, then
// redirects to `next` (or the community board).
export async function GET(request: Request) {
  const { searchParams, origin } = new URL(request.url);
  const code = searchParams.get("code");
  const rawNext = searchParams.get("next") ?? "/community";
  // Only same-site relative paths — "/x" but not "//host" or absolute URLs
  // (open-redirect guard on an attacker-supplied query param).
  const next = rawNext.startsWith("/") && !rawNext.startsWith("//") ? rawNext : "/community";

  if (code) {
    const supabase = await createClient();
    const { error } = await supabase.auth.exchangeCodeForSession(code);
    if (!error) {
      return NextResponse.redirect(`${origin}${next}`);
    }
  }

  return NextResponse.redirect(`${origin}/account?error=auth`);
}
