import "server-only";
import { cache } from "react";
import { createClient } from "@/lib/supabase/server";
import type { Answer, Post, PostType, Profile } from "@/lib/types";

const AUTHOR = "author:profiles(id,display_name,avatar_url,is_admin)";

/** The signed-in user + their profile, or null. Safe to call anywhere.
 *  cache(): deduped per request (layout + page + metadata share one read). */
export const getCurrentUser = cache(
  async (): Promise<{ id: string; email?: string; profile: Profile | null } | null> => {
    if (!process.env.NEXT_PUBLIC_SUPABASE_URL) return null;
    const supabase = await createClient();
    const {
      data: { user },
    } = await supabase.auth.getUser();
    if (!user) return null;
    const { data: profile } = await supabase.from("profiles").select("*").eq("id", user.id).single();
    return { id: user.id, email: user.email, profile: (profile as Profile) ?? null };
  },
);

/** Posts of a given type. RLS already hides removed/expired rows from anon. */
export async function listPosts(
  type: PostType,
  opts: { category?: string; sort?: "new" | "top"; limit?: number } = {},
): Promise<Post[]> {
  if (!process.env.NEXT_PUBLIC_SUPABASE_URL) return [];
  const supabase = await createClient();
  let q = supabase.from("posts").select(`*, ${AUTHOR}`).eq("type", type).eq("status", "active");
  if (opts.category) q = q.eq("category", opts.category);
  q = opts.sort === "top"
    ? q.order("score", { ascending: false }).order("created_at", { ascending: false })
    : q.order("created_at", { ascending: false });
  const { data } = await q.limit(opts.limit ?? 100);
  return (data as Post[]) ?? [];
}

/** cache(): deduped per request — generateMetadata + the page share one read. */
export const getPost = cache(async (id: string): Promise<Post | null> => {
  if (!process.env.NEXT_PUBLIC_SUPABASE_URL) return null;
  const supabase = await createClient();
  const { data } = await supabase.from("posts").select(`*, ${AUTHOR}`).eq("id", id).maybeSingle();
  return (data as Post) ?? null;
});

export async function listAnswers(postId: string): Promise<Answer[]> {
  if (!process.env.NEXT_PUBLIC_SUPABASE_URL) return [];
  const supabase = await createClient();
  const { data } = await supabase
    .from("answers")
    .select(`*, ${AUTHOR}`)
    .eq("post_id", postId)
    .order("score", { ascending: false })
    .order("created_at", { ascending: true });
  return (data as Answer[]) ?? [];
}

/** The current user's votes on the given targets → map of targetId → ±1. */
export async function getMyVotes(
  targetType: "post" | "answer",
  ids: string[],
): Promise<Record<string, number>> {
  if (!process.env.NEXT_PUBLIC_SUPABASE_URL || ids.length === 0) return {};
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) return {};
  const { data } = await supabase
    .from("votes")
    .select("target_id,value")
    .eq("voter_id", user.id)
    .eq("target_type", targetType)
    .in("target_id", ids);
  const map: Record<string, number> = {};
  for (const v of data ?? []) map[(v as { target_id: string }).target_id] = (v as { value: number }).value;
  return map;
}

/** All recent question ids, for the sitemap. */
export async function listQuestionIdsForSitemap(): Promise<{ id: string; created_at: string }[]> {
  if (!process.env.NEXT_PUBLIC_SUPABASE_URL) return [];
  const supabase = await createClient();
  const { data } = await supabase
    .from("posts")
    .select("id,created_at")
    .eq("type", "question")
    .eq("status", "active")
    .order("created_at", { ascending: false })
    .limit(1000);
  return (data as { id: string; created_at: string }[]) ?? [];
}
