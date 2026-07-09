-- Desi GR Hub v4: admin moderation, team management, email notification preferences.
-- Apply AFTER 0001, 0002, 0003. Reuses is_admin() and introduces can_moderate().

-- ---------- profiles: add moderator + notification prefs ----------
alter table profiles add column can_moderate_reports boolean not null default false;
alter table profiles add column notify_on_report boolean not null default false;

-- ---------- reports: add resolution tracking ----------
alter table reports add column status text not null default 'open' check (status in ('open', 'resolved'));
create index reports_status_created_idx on reports (status, created_at desc);

-- ---------- helper: can the current user moderate reports? ----------
-- Either admin (full privileges) or has explicit can_moderate_reports permission.
create function can_moderate() returns boolean
  language sql security definer stable set search_path = public as $$
  select coalesce(
    (select is_admin or can_moderate_reports from profiles where id = auth.uid()),
    false
  );
$$;

-- ---------- helper: find a user by email (admin-only) ----------
-- Returns the user's UUID if the caller is an admin and a matching email is found.
-- Used by the team management page to look up users before promoting/demoting them.
create function find_user_id_by_email(lookup_email text) returns uuid
  language sql security definer stable set search_path = public as $$
  select case when is_admin() then (select id from auth.users where email = lookup_email) end;
$$;

-- ---------- RLS: expand moderator privileges ----------
-- profiles: allow full admins to manage other users' roles.
drop policy if exists profiles_update on profiles;
create policy profiles_update on profiles for update
  using (id = auth.uid() or is_admin())
  with check (id = auth.uid() or is_admin());

-- reports: moderators (not just admins) can read and update.
drop policy if exists reports_read on reports;
create policy reports_read on reports for select using (can_moderate());
create policy reports_update on reports for update
  using (can_moderate())
  with check (can_moderate());

-- posts: moderators can close/delete reported content.
drop policy if exists posts_update on posts;
drop policy if exists posts_delete on posts;
create policy posts_update on posts for update
  using (author_id = auth.uid() or can_moderate())
  with check (author_id = auth.uid() or can_moderate());
create policy posts_delete on posts for delete
  using (author_id = auth.uid() or can_moderate());

-- answers: moderators can close/delete reported content.
drop policy if exists answers_update on answers;
drop policy if exists answers_delete on answers;
create policy answers_update on answers for update
  using (author_id = auth.uid() or can_moderate())
  with check (author_id = auth.uid() or can_moderate());
create policy answers_delete on answers for delete
  using (author_id = auth.uid() or can_moderate());
