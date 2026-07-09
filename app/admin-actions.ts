"use server";

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { createClient } from "@/lib/supabase/server";

// Admin-only content actions for Events + the Newcomer guide. RLS (0003) is the
// real gate; this re-checks admin server-side (actions are POST-reachable) and
// gives a clean redirect for non-admins.
async function requireAdmin() {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) redirect("/account");
  const { data: profile } = await supabase
    .from("profiles")
    .select("is_admin")
    .eq("id", user.id)
    .single();
  if (!profile?.is_admin) redirect("/");
  return { supabase, user };
}

// Moderators (is_admin OR can_moderate_reports) can access reports and moderate content.
async function requireModerator() {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) redirect("/account");
  const { data: profile } = await supabase
    .from("profiles")
    .select("is_admin,can_moderate_reports")
    .eq("id", user.id)
    .single();
  if (!profile?.is_admin && !profile?.can_moderate_reports) redirect("/");
  return { supabase, user, profile };
}

function str(fd: FormData, key: string): string {
  return (fd.get(key) as string | null)?.trim() ?? "";
}
function num(fd: FormData, key: string): number {
  return parseInt(str(fd, key), 10) || 0;
}
function bool(fd: FormData, key: string): boolean {
  return fd.get(key) === "on";
}

// ---------- Events ----------
function eventFields(fd: FormData) {
  return {
    title: str(fd, "title"),
    description: str(fd, "description"),
    event_date: str(fd, "event_date"),
    event_time: str(fd, "event_time") || null,
    location: str(fd, "location"),
    map_url: str(fd, "map_url") || null,
    rsvp_url: str(fd, "rsvp_url") || null,
  };
}

export async function createEvent(formData: FormData) {
  const { supabase } = await requireAdmin();
  await supabase.from("events").insert(eventFields(formData));
  revalidatePath("/events");
}
export async function updateEvent(formData: FormData) {
  const { supabase } = await requireAdmin();
  await supabase.from("events").update(eventFields(formData)).eq("id", str(formData, "id"));
  revalidatePath("/events");
}
export async function deleteEvent(formData: FormData) {
  const { supabase } = await requireAdmin();
  await supabase.from("events").delete().eq("id", str(formData, "id"));
  revalidatePath("/events");
}

// ---------- Newcomer sections ----------
export async function createSection(formData: FormData) {
  const { supabase } = await requireAdmin();
  await supabase.from("newcomer_sections").insert({
    slug: str(formData, "slug") || crypto.randomUUID().slice(0, 8),
    title: str(formData, "title"),
    intro: str(formData, "intro"),
    sort_order: num(formData, "sort_order"),
  });
  revalidatePath("/newcomers");
}
export async function updateSection(formData: FormData) {
  const { supabase } = await requireAdmin();
  await supabase
    .from("newcomer_sections")
    .update({
      title: str(formData, "title"),
      intro: str(formData, "intro"),
      sort_order: num(formData, "sort_order"),
    })
    .eq("id", str(formData, "id"));
  revalidatePath("/newcomers");
}
export async function deleteSection(formData: FormData) {
  const { supabase } = await requireAdmin();
  await supabase.from("newcomer_sections").delete().eq("id", str(formData, "id"));
  revalidatePath("/newcomers");
}

// ---------- Newcomer entries ----------
export async function createEntry(formData: FormData) {
  const { supabase } = await requireAdmin();
  await supabase.from("newcomer_entries").insert({
    section_id: str(formData, "section_id"),
    name: str(formData, "name"),
    detail: str(formData, "detail"),
    url: str(formData, "url") || null,
    sort_order: num(formData, "sort_order"),
  });
  revalidatePath("/newcomers");
}
export async function updateEntry(formData: FormData) {
  const { supabase } = await requireAdmin();
  await supabase
    .from("newcomer_entries")
    .update({
      name: str(formData, "name"),
      detail: str(formData, "detail"),
      url: str(formData, "url") || null,
      sort_order: num(formData, "sort_order"),
    })
    .eq("id", str(formData, "id"));
  revalidatePath("/newcomers");
}
export async function deleteEntry(formData: FormData) {
  const { supabase } = await requireAdmin();
  await supabase.from("newcomer_entries").delete().eq("id", str(formData, "id"));
  revalidatePath("/newcomers");
}

// ---------- Report moderation ----------
export async function moderateReports(formData: FormData) {
  const { supabase } = await requireModerator();
  const action = str(formData, "action");
  if (!["dismiss", "close", "delete"].includes(action)) throw new Error("Invalid action");

  // Targets are encoded as "post:<id>" or "answer:<id>", one per checkbox.
  const targetStrings = formData.getAll("targets") as string[];
  if (!targetStrings.length) return; // No targets selected, no-op.

  const posts = new Set<string>();
  const answers = new Set<string>();
  for (const t of targetStrings) {
    if (t.startsWith("post:")) posts.add(t.slice(5));
    else if (t.startsWith("answer:")) answers.add(t.slice(7));
  }

  // Mark all matched reports as resolved.
  const reportTargets = targetStrings.flatMap(t => {
    const [type, id] = t.split(":") as [string, string];
    return { type: type as "post" | "answer", id };
  });
  if (reportTargets.length > 0) {
    await supabase
      .from("reports")
      .update({ status: "resolved" })
      .in("target_id", reportTargets.map(r => r.id));
  }

  // Apply the action: close (set status='closed') or delete the content.
  if (action === "close" || action === "dismiss") {
    if (posts.size > 0) {
      await supabase.from("posts").update({ status: "closed" }).in("id", Array.from(posts));
    }
  } else if (action === "delete") {
    if (posts.size > 0) {
      await supabase.from("posts").delete().in("id", Array.from(posts));
    }
    if (answers.size > 0) {
      await supabase.from("answers").delete().in("id", Array.from(answers));
    }
  }

  revalidatePath("/admin");
}

export async function updateNotifyPreference(formData: FormData) {
  const { supabase, user } = await requireModerator();
  const notifyOnReport = bool(formData, "notify_on_report");
  await supabase
    .from("profiles")
    .update({ notify_on_report: notifyOnReport })
    .eq("id", user.id);
  revalidatePath("/admin");
}

// ---------- Team management (admin-only) ----------
export async function promoteUser(formData: FormData) {
  const { supabase } = await requireAdmin();
  const email = str(formData, "email");
  if (!email) throw new Error("Email required");

  // Look up the user by email using the SQL helper (admin-only).
  const { data: userId } = await supabase.rpc("find_user_id_by_email", {
    lookup_email: email,
  });

  if (!userId) {
    redirect(
      `/admin/team?error=${encodeURIComponent(
        "No user found with that email — ask them to sign in once first, then try again.",
      )}`,
    );
  }

  const isAdmin = bool(formData, "is_admin");
  const canModerate = bool(formData, "can_moderate_reports");
  await supabase
    .from("profiles")
    .update({ is_admin: isAdmin, can_moderate_reports: canModerate })
    .eq("id", userId);

  revalidatePath("/admin/team");
}

export async function updateTeamMember(formData: FormData) {
  const { supabase, user } = await requireAdmin();
  const id = str(formData, "id");

  // Prevent self-edit to avoid accidental lockout.
  if (id === user.id) {
    redirect(`/admin/team?error=${encodeURIComponent("You cannot edit your own role.")}`);
  }

  const isAdmin = bool(formData, "is_admin");
  const canModerate = bool(formData, "can_moderate_reports");
  await supabase
    .from("profiles")
    .update({ is_admin: isAdmin, can_moderate_reports: canModerate })
    .eq("id", id);

  revalidatePath("/admin/team");
}
