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
