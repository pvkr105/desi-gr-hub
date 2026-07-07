import { createServerClient } from "@supabase/ssr";
import { NextResponse, type NextRequest } from "next/server";

// Refreshes the Supabase auth session on each request and syncs the cookie
// onto the response. Called from the root proxy.ts (Next 16's renamed
// middleware). Standard @supabase/ssr pattern.
export async function updateSession(request: NextRequest) {
  let response = NextResponse.next({ request });

  // If env isn't configured yet, do nothing (community features are simply off).
  if (!process.env.NEXT_PUBLIC_SUPABASE_URL) return response;

  const supabase = createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    {
      cookies: {
        getAll() {
          return request.cookies.getAll();
        },
        setAll(cookiesToSet) {
          cookiesToSet.forEach(({ name, value }) => request.cookies.set(name, value));
          response = NextResponse.next({ request });
          cookiesToSet.forEach(({ name, value, options }) =>
            response.cookies.set(name, value, options),
          );
        },
      },
    },
  );

  // IMPORTANT: refreshes tokens; do not run code between client creation and this.
  await supabase.auth.getUser();

  return response;
}
