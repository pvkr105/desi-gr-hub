import type { PostType } from "@/lib/types";

// Client-safe constants & helpers for the community board. NO server-only
// imports here — Client Components (forms) import from this file.

/** URL segment ↔ DB post_type. Segments are the pretty plural-ish names. */
export const SEGMENT_TO_TYPE: Record<string, PostType> = {
  questions: "question",
  housing: "housing",
  marketplace: "marketplace",
};
export const TYPE_TO_SEGMENT: Record<PostType, string> = {
  question: "questions",
  housing: "housing",
  marketplace: "marketplace",
};

export const TYPE_META: Record<
  PostType,
  { label: string; noun: string; emoji: string; blurb: string }
> = {
  question: {
    label: "Q&A",
    noun: "question",
    emoji: "💬",
    blurb: "Ask the community anything about life in Grand Rapids and West Michigan.",
  },
  housing: {
    label: "Housing & Roommates",
    noun: "listing",
    emoji: "🏠",
    blurb: "Rooms, roommates, sublets, and apartments. Listings expire automatically.",
  },
  marketplace: {
    label: "Marketplace",
    noun: "listing",
    emoji: "🛍️",
    blurb: "Buy and sell within the community. Listings expire automatically.",
  },
};

export const CATEGORIES: Record<PostType, string[]> = {
  question: ["General", "Immigration", "Jobs", "Housing", "Transport", "Food", "Health", "Other"],
  housing: ["Room for rent", "Roommate wanted", "Apartment", "Sublet", "Temporary stay"],
  marketplace: ["Furniture", "Electronics", "Car", "Kitchen", "Clothing", "Free", "Other"],
};

/** Listings (housing/marketplace) expire; questions don't. */
export const EXPIRES: Record<PostType, boolean> = {
  question: false,
  housing: true,
  marketplace: true,
};

export const DEFAULT_EXPIRY_DAYS = 30;

/** Durations a member can pick for a listing (days). */
export const EXPIRY_OPTIONS = [7, 14, 30, 60] as const;

/** Posts are editable for 24h after creation; after that, delete & repost. */
export const EDIT_WINDOW_MS = 24 * 60 * 60 * 1000;

export function canEdit(createdAt: string): boolean {
  return Date.now() - new Date(createdAt).getTime() < EDIT_WINDOW_MS;
}

export const MAX_IMAGES = 4;

/** Public URL prefix for the post-images bucket (both server & client see NEXT_PUBLIC). */
export function imagePublicPrefix(): string {
  return `${process.env.NEXT_PUBLIC_SUPABASE_URL}/storage/v1/object/public/post-images/`;
}

/** Allow-list image URLs to our own bucket — blocks arbitrary/injected URLs. */
export function isOurImageUrl(u: string): boolean {
  return typeof u === "string" && u.startsWith(imagePublicPrefix());
}

export function isPostType(v: string): v is PostType {
  return v === "question" || v === "housing" || v === "marketplace";
}

export function formatPrice(price: number | null): string | null {
  if (price == null) return null;
  return new Intl.NumberFormat("en-US", {
    style: "currency",
    currency: "USD",
    maximumFractionDigits: 0,
  }).format(price);
}

export function timeAgo(iso: string): string {
  const diff = Date.now() - new Date(iso).getTime();
  const mins = Math.floor(diff / 60000);
  if (mins < 1) return "just now";
  if (mins < 60) return `${mins}m ago`;
  const hrs = Math.floor(mins / 60);
  if (hrs < 24) return `${hrs}h ago`;
  const days = Math.floor(hrs / 24);
  if (days < 30) return `${days}d ago`;
  return new Date(iso).toLocaleDateString("en-US", { month: "short", day: "numeric" });
}
