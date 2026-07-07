// All content types for Desi GR Hub. Content lives in data/*.ts, edit those,
// never components, to update the site.

export interface Group {
  slug: string;
  name: string;
  emoji: string;
  tagline: string;
  /** Full description shown on the group detail page. */
  description: string;
  /** Direct WhatsApp invite link. Null = no public link yet; join via the main hub. */
  joinUrl: string | null;
  /** Per-group rules, shown as a list on the detail page. */
  guidelines: string[];
  /** Group-specific disclaimer(s). */
  disclaimers: string[];
  /** SEO: extra keyword-rich sentence woven into the detail page intro. */
  seoBlurb: string;
}

export interface Faq {
  question: string;
  /** Plain-text answer; may contain multiple sentences. */
  answer: string;
}

export interface Announcement {
  /** ISO date, e.g. "2026-07-05". */
  date: string;
  title: string;
  body: string;
}

export interface Guideline {
  title: string;
  detail: string;
}

export interface Event {
  /** ISO date, e.g. "2026-08-15". */
  date: string;
  /** Optional display time, e.g. "6:00 PM". */
  time?: string;
  title: string;
  location: string;
  /** Optional Google Maps (or any) link for the location. */
  mapUrl?: string;
  description: string;
  /** Optional RSVP / details link (usually a WhatsApp group or the main hub). */
  rsvpUrl?: string;
}

/** One entry inside a Newcomer's Guide section. */
export interface GuideEntry {
  name: string;
  detail: string;
  /** Optional external link (map, website). */
  url?: string;
}

export interface GuideSection {
  id: string;
  title: string;
  intro: string;
  entries: GuideEntry[];
}

// ---------- v2 community board (DB-backed via Supabase) ----------

export type PostType = "question" | "housing" | "marketplace";
export type PostStatus = "active" | "closed" | "removed";
export type TargetKind = "post" | "answer";

export interface Profile {
  id: string;
  display_name: string | null;
  avatar_url: string | null;
  is_admin: boolean;
}

export interface Post {
  id: string;
  type: PostType;
  category: string | null;
  title: string;
  body: string;
  author_id: string;
  contact: string | null;
  price: number | null;
  location: string | null;
  status: PostStatus;
  score: number;
  details: Record<string, unknown>;
  image_urls: string[];
  created_at: string;
  updated_at: string | null;
  expires_at: string | null;
  /** Joined author profile (present when the query selects it). */
  author?: Profile | null;
}

// ---------- v3 admin-managed content (DB-backed, was data/*.ts) ----------

export interface EventRow {
  id: string;
  title: string;
  description: string;
  /** ISO date, e.g. "2026-08-15". */
  event_date: string;
  event_time: string | null;
  location: string;
  map_url: string | null;
  rsvp_url: string | null;
  created_at: string;
}

export interface NewcomerEntryRow {
  id: string;
  section_id: string;
  name: string;
  detail: string;
  url: string | null;
  sort_order: number;
}

export interface NewcomerSectionRow {
  id: string;
  slug: string;
  title: string;
  intro: string;
  sort_order: number;
  entries: NewcomerEntryRow[];
}

export interface Answer {
  id: string;
  post_id: string;
  body: string;
  author_id: string;
  score: number;
  created_at: string;
  author?: Profile | null;
}

export type BusinessCategory =
  | "Food"
  | "Services"
  | "Real Estate"
  | "Retail"
  | "Health"
  | "Other";

export interface Business {
  name: string;
  category: BusinessCategory;
  description: string;
  /** wa.me link, website, or mailto. */
  contactUrl: string;
  contactLabel: string;
}
