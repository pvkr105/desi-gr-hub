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
  return { supabase };
}

function str(fd: FormData, key: string): string {
  return (fd.get(key) as string | null)?.trim() ?? "";
}
function num(fd: FormData, key: string): number {
  return parseInt(str(fd, key), 10) || 0;
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
