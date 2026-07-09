import { NextResponse } from "next/server";

export const dynamic = "force-dynamic";

// Pinged daily by Vercel cron (vercel.json) so the free-tier Supabase project
// never pauses from inactivity. One trivial REST select counts as activity;
// no cookies/session needed. Harmless if hit by anyone else.
export async function GET() {
  const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const key = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;
  if (!url || !key) {
    return NextResponse.json({ ok: false, reason: "supabase env not configured" });
  }
  const res = await fetch(`${url}/rest/v1/faqs?select=id&limit=1`, {
    headers: { apikey: key, authorization: `Bearer ${key}` },
    cache: "no-store",
  });
  return NextResponse.json({ ok: res.ok });
}
