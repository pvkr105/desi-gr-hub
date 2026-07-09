import "server-only";
import { cache } from "react";
import { createClient } from "@/lib/supabase/server";
import type {
  AnnouncementRow,
  Answer,
  BusinessRow,
  EventRow,
  FaqRow,
  GuidelineRow,
  NewcomerSectionRow,
  Post,
  PostType,
  Profile,
  Report,
  ReportGroup,
  SafetyDisclaimerRow,
} from "@/lib/types";

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

/** All events, newest-dated first. Admin-managed (was data/events.ts). */
export async function listEvents(): Promise<EventRow[]> {
  if (!process.env.NEXT_PUBLIC_SUPABASE_URL) return [];
  const supabase = await createClient();
  const { data } = await supabase.from("events").select("*").order("event_date", { ascending: false });
  return (data as EventRow[]) ?? [];
}

/** Newcomer guide: sections with their nested entries, ordered. */
export async function listNewcomerSections(): Promise<NewcomerSectionRow[]> {
  if (!process.env.NEXT_PUBLIC_SUPABASE_URL) return [];
  const supabase = await createClient();
  const { data } = await supabase
    .from("newcomer_sections")
    .select("*, entries:newcomer_entries(*)")
    .order("sort_order", { ascending: true })
    .order("sort_order", { referencedTable: "newcomer_entries", ascending: true });
  return (data as NewcomerSectionRow[]) ?? [];
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

/** Open reports, grouped by target (post/answer), newest first. */
export async function listOpenReports(): Promise<ReportGroup[]> {
  if (!process.env.NEXT_PUBLIC_SUPABASE_URL) return [];
  const supabase = await createClient();
  const { data } = await supabase
    .from("reports")
    .select("*")
    .eq("status", "open")
    .order("created_at", { ascending: false })
    .limit(300);

  if (!data?.length) return [];

  const reports = (data as Report[]) ?? [];

  // Group by target_type:target_id; collect reasons, count, latest timestamp.
  const grouped = new Map<string, { reports: Report[]; reasons: Set<string> }>();
  for (const r of reports) {
    const key = `${r.target_type}:${r.target_id}`;
    if (!grouped.has(key)) {
      grouped.set(key, { reports: [], reasons: new Set() });
    }
    const g = grouped.get(key)!;
    g.reports.push(r);
    if (r.reason) g.reasons.add(r.reason);
  }

  // Batch-fetch the referenced posts/answers.
  const postIds = Array.from(new Set(
    reports.filter(r => r.target_type === "post").map(r => r.target_id)
  ));
  const answerIds = Array.from(new Set(
    reports.filter(r => r.target_type === "answer").map(r => r.target_id)
  ));

  const [postsData, answersData] = await Promise.all([
    postIds.length > 0
      ? supabase.from("posts").select(`*, ${AUTHOR}`).in("id", postIds)
      : Promise.resolve({ data: [] }),
    answerIds.length > 0
      ? supabase.from("answers").select(`*, ${AUTHOR}`).in("id", answerIds)
      : Promise.resolve({ data: [] }),
  ]);

  const postsMap = new Map((postsData.data as Post[])?.map(p => [p.id, p]) ?? []);
  const answersMap = new Map((answersData.data as Answer[])?.map(a => [a.id, a]) ?? []);

  // Build ReportGroup entries.
  const result: ReportGroup[] = [];
  for (const [key, { reports: rs, reasons }] of grouped) {
    const [type, id] = key.split(":") as [any, string];
    const target = type === "post" ? postsMap.get(id) ?? null : answersMap.get(id) ?? null;
    result.push({
      target_type: type,
      target_id: id,
      count: rs.length,
      reasons: Array.from(reasons),
      latest_at: rs[0]!.created_at,
      target,
    });
  }

  return result;
}

/** All signed-up users (profiles), newest first, with the total count. */
export async function listProfiles(): Promise<{ count: number; profiles: Profile[] }> {
  if (!process.env.NEXT_PUBLIC_SUPABASE_URL) return { count: 0, profiles: [] };
  const supabase = await createClient();
  const { data, count } = await supabase
    .from("profiles")
    .select("*", { count: "exact" })
    .order("created_at", { ascending: false })
    .limit(200);
  return { count: count ?? 0, profiles: (data as Profile[]) ?? [] };
}

/** All admins and moderators, admins first. */
export async function listModerators(): Promise<Profile[]> {
  if (!process.env.NEXT_PUBLIC_SUPABASE_URL) return [];
  const supabase = await createClient();
  const { data } = await supabase
    .from("profiles")
    .select("*")
    .or("is_admin.eq.true,can_moderate_reports.eq.true")
    .order("is_admin", { ascending: false })
    .order("display_name", { ascending: true });
  return (data as Profile[]) ?? [];
}

/** All announcements, newest first. */
export async function listAnnouncements(): Promise<AnnouncementRow[]> {
  if (!process.env.NEXT_PUBLIC_SUPABASE_URL) return [];
  const supabase = await createClient();
  const { data } = await supabase
    .from("announcements")
    .select("*")
    .order("date", { ascending: false });
  return (data as AnnouncementRow[]) ?? [];
}

/** All FAQs, by sort order. */
export async function listFaqs(): Promise<FaqRow[]> {
  if (!process.env.NEXT_PUBLIC_SUPABASE_URL) return [];
  const supabase = await createClient();
  const { data } = await supabase
    .from("faqs")
    .select("*")
    .order("sort_order", { ascending: true });
  return (data as FaqRow[]) ?? [];
}

/** All guidelines, by sort order. */
export async function listGuidelines(): Promise<GuidelineRow[]> {
  if (!process.env.NEXT_PUBLIC_SUPABASE_URL) return [];
  const supabase = await createClient();
  const { data } = await supabase
    .from("guidelines")
    .select("*")
    .order("sort_order", { ascending: true });
  return (data as GuidelineRow[]) ?? [];
}

/** All safety disclaimers, by sort order. */
export async function listSafetyDisclaimers(): Promise<SafetyDisclaimerRow[]> {
  if (!process.env.NEXT_PUBLIC_SUPABASE_URL) return [];
  const supabase = await createClient();
  const { data } = await supabase
    .from("safety_disclaimers")
    .select("*")
    .order("sort_order", { ascending: true });
  return (data as SafetyDisclaimerRow[]) ?? [];
}

/** All businesses. */
export async function listBusinesses(): Promise<BusinessRow[]> {
  if (!process.env.NEXT_PUBLIC_SUPABASE_URL) return [];
  const supabase = await createClient();
  const { data } = await supabase
    .from("businesses")
    .select("*")
    .order("created_at", { ascending: true });
  return (data as BusinessRow[]) ?? [];
}
