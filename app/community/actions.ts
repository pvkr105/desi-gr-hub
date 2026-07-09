"use server";

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { createClient } from "@/lib/supabase/server";
import {
  DEFAULT_EXPIRY_DAYS,
  EXPIRY_OPTIONS,
  EXPIRES,
  MAX_IMAGES,
  TYPE_TO_SEGMENT,
  canEdit,
  isOurImageUrl,
  isPostType,
} from "@/lib/community";
import type { PostType, TargetKind } from "@/lib/types";
import { notifyReportFiled } from "@/lib/notify";

// Every action re-checks auth on the server — Server Actions are reachable via
// direct POST, and RLS is the second line of defense (Next 16 data-security note).
async function requireUser() {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) redirect("/account?next=/community");
  return { supabase, user };
}

function str(fd: FormData, key: string): string {
  return (fd.get(key) as string | null)?.trim() ?? "";
}

// DB errors (check constraints, rate-limit triggers) → messages a member can act on.
function friendly(msg: string): string {
  if (msg.includes("Rate limit")) return msg;
  if (msg.includes("title")) return "Title must be 3–160 characters.";
  if (msg.includes("body")) return "Details must be 1–8,000 characters.";
  return "Couldn't save your post. Please try again.";
}

// Required-field check. All fields shown for the type are required, except contact
// is optional on questions. Returns an error message, or null when valid.
function missingField(type: PostType, fd: FormData): string | null {
  if (!str(fd, "title")) return "Title is required.";
  if (!str(fd, "category")) return "Please pick a category.";
  if (!str(fd, "body")) return "Details are required.";
  if (type !== "question" && !str(fd, "contact")) return "Contact info is required.";
  if (EXPIRES[type]) {
    const price = str(fd, "price");
    if (price === "" || Number.isNaN(Number(price)) || Number(price) < 0) {
      return "A price is required (enter 0 for free).";
    }
    if (!str(fd, "location")) return "Location is required.";
  }
  return null;
}

// Parse the hidden image_urls field (JSON array) and allow-list to our bucket.
function parseImages(fd: FormData): string[] {
  const raw = str(fd, "image_urls");
  if (!raw) return [];
  try {
    const arr = JSON.parse(raw);
    if (!Array.isArray(arr)) return [];
    return arr.filter((u): u is string => isOurImageUrl(u)).slice(0, MAX_IMAGES);
  } catch {
    return [];
  }
}

export async function createPost(formData: FormData) {
  const { supabase, user } = await requireUser();

  const type = str(formData, "type") as PostType;
  if (!isPostType(type)) throw new Error("Invalid post type");

  const invalid = missingField(type, formData);
  if (invalid) {
    redirect(`/community/new?type=${TYPE_TO_SEGMENT[type]}&error=${encodeURIComponent(invalid)}`);
  }

  const price = str(formData, "price");
  // Listings expire; the member picks the window (validated against the allow-list).
  const picked = Number(str(formData, "duration"));
  const durationDays = (EXPIRY_OPTIONS as readonly number[]).includes(picked)
    ? picked
    : DEFAULT_EXPIRY_DAYS;
  const expires_at = EXPIRES[type]
    ? new Date(Date.now() + durationDays * 86400_000).toISOString()
    : null;

  const { data, error } = await supabase
    .from("posts")
    .insert({
      type,
      category: str(formData, "category") || null,
      title: str(formData, "title"),
      body: str(formData, "body"),
      author_id: user.id,
      contact: str(formData, "contact") || null,
      price: price ? Number(price) : null,
      location: str(formData, "location") || null,
      image_urls: parseImages(formData),
      expires_at,
    })
    .select("id")
    .single();

  // Redirect back to the form with a readable message instead of throwing —
  // thrown action errors surface as an opaque digest page in production.
  if (error) {
    redirect(
      `/community/new?type=${TYPE_TO_SEGMENT[type]}&error=${encodeURIComponent(friendly(error.message))}`,
    );
  }

  revalidatePath(`/community/${TYPE_TO_SEGMENT[type]}`);
  redirect(`/community/${TYPE_TO_SEGMENT[type]}/${data.id}`);
}

export async function editPost(formData: FormData) {
  const { supabase, user } = await requireUser();
  const id = str(formData, "id");
  const type = str(formData, "type") as PostType;
  if (!isPostType(type)) throw new Error("Invalid post type");
  const seg = TYPE_TO_SEGMENT[type];

  const { data: post } = await supabase
    .from("posts")
    .select("author_id, created_at")
    .eq("id", id)
    .maybeSingle();
  if (!post) redirect(`/community/${seg}`);
  // Ownership + 24h window (RLS is the second gate).
  if (post.author_id !== user.id) redirect(`/community/${seg}/${id}`);
  if (!canEdit(post.created_at)) {
    redirect(
      `/community/${seg}/${id}?error=${encodeURIComponent(
        "The 24-hour editing window has closed — please delete and repost.",
      )}`,
    );
  }

  const invalid = missingField(type, formData);
  if (invalid) redirect(`/community/${seg}/${id}/edit?error=${encodeURIComponent(invalid)}`);

  const price = str(formData, "price");
  const { error } = await supabase
    .from("posts")
    .update({
      category: str(formData, "category") || null,
      title: str(formData, "title"),
      body: str(formData, "body"),
      contact: str(formData, "contact") || null,
      price: price ? Number(price) : null,
      location: str(formData, "location") || null,
      image_urls: parseImages(formData),
      updated_at: new Date().toISOString(),
    })
    .eq("id", id);
  if (error) redirect(`/community/${seg}/${id}/edit?error=${encodeURIComponent(friendly(error.message))}`);

  revalidatePath(`/community/${seg}/${id}`);
  redirect(`/community/${seg}/${id}`);
}

export async function addAnswer(formData: FormData) {
  const { supabase, user } = await requireUser();
  const post_id = str(formData, "post_id");
  const body = str(formData, "body");
  if (!post_id || !body) throw new Error("Missing answer");

  const { error } = await supabase.from("answers").insert({ post_id, body, author_id: user.id });
  if (error) {
    redirect(`/community/questions/${post_id}?error=${encodeURIComponent(friendly(error.message))}`);
  }

  revalidatePath(`/community/questions/${post_id}`);
}

export async function castVote(formData: FormData) {
  const { supabase, user } = await requireUser();
  const target_type = str(formData, "target_type") as TargetKind;
  const target_id = str(formData, "target_id");
  const value = Number(str(formData, "value")); // 1 or -1
  const path = str(formData, "path") || "/community";
  if ((value !== 1 && value !== -1) || !target_id) throw new Error("Bad vote");

  // Toggle: same value again removes the vote; a different value replaces it.
  const { data: existing } = await supabase
    .from("votes")
    .select("id,value")
    .eq("voter_id", user.id)
    .eq("target_type", target_type)
    .eq("target_id", target_id)
    .maybeSingle();

  if (!existing) {
    await supabase.from("votes").insert({ voter_id: user.id, target_type, target_id, value });
  } else if (existing.value === value) {
    await supabase.from("votes").delete().eq("id", existing.id);
  } else {
    await supabase.from("votes").update({ value }).eq("id", existing.id);
  }

  revalidatePath(path);
}

export async function reportContent(formData: FormData) {
  const { supabase, user } = await requireUser();
  const target_type = str(formData, "target_type") as TargetKind;
  const target_id = str(formData, "target_id");
  const reason = str(formData, "reason") || null;
  if (!target_id) throw new Error("Nothing to report");

  await supabase.from("reports").insert({ reporter_id: user.id, target_type, target_id, reason });
  revalidatePath(str(formData, "path") || "/community");

  // Best-effort notification to admins/moderators (swallows errors).
  await notifyReportFiled({ targetType: target_type, targetId: target_id, reason });
}

// useActionState wrapper so the Report button can show "Reported ✓" feedback.
export async function reportAndAck(
  _prev: { done: boolean },
  formData: FormData,
): Promise<{ done: boolean }> {
  await reportContent(formData);
  return { done: true };
}

export async function closePost(formData: FormData) {
  const { supabase } = await requireUser();
  const id = str(formData, "id");
  // RLS ensures only the author or an admin can update.
  await supabase.from("posts").update({ status: "closed" }).eq("id", id);
  revalidatePath(str(formData, "path") || "/community");
}

export async function deletePost(formData: FormData) {
  const { supabase } = await requireUser();
  const id = str(formData, "id");
  const type = str(formData, "type") as PostType;
  // RLS ensures only the author or an admin can delete.
  await supabase.from("posts").delete().eq("id", id);
  redirect(`/community/${isPostType(type) ? TYPE_TO_SEGMENT[type] : ""}`);
}

export async function signOut() {
  const supabase = await createClient();
  await supabase.auth.signOut({ scope: "local" });
  revalidatePath("/account");
  revalidatePath("/");
  redirect("/goodbye");
}
