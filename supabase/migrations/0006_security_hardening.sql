-- Desi GR Hub v6: security hardening. Apply AFTER 0001–0005.

-- ---------- 1) Block self-promotion to admin ----------
-- profiles_update RLS lets users update their own row, and RLS has no
-- column-level control — without this trigger any signed-in user could PATCH
-- their own row via PostgREST and set is_admin = true.
create function protect_privileged_columns() returns trigger
  language plpgsql security definer set search_path = public as $$
begin
  if (new.is_admin is distinct from old.is_admin
      or new.can_moderate_reports is distinct from old.can_moderate_reports)
     -- auth.uid() is null in the SQL editor / service role, so the
     -- first-admin bootstrap in SETUP.md keeps working.
     and auth.uid() is not null
     and not is_admin() then
    raise exception 'Only admins can change admin or moderator roles.';
  end if;
  return new;
end;
$$;
create trigger profiles_protect_privileges
  before update on profiles
  for each row execute function protect_privileged_columns();

-- ---------- 2) URL columns must be http(s) ----------
-- Defense in depth against javascript: links rendered as href on public pages.
-- The server actions validate too; this catches any other write path.
alter table businesses add constraint businesses_contact_url_http
  check (contact_url ~ '^https?://');
alter table events add constraint events_map_url_http
  check (map_url is null or map_url ~ '^https?://');
alter table events add constraint events_rsvp_url_http
  check (rsvp_url is null or rsvp_url ~ '^https?://');
alter table newcomer_entries add constraint newcomer_entries_url_http
  check (url is null or url ~ '^https?://');

-- ---------- 3) Moderators can see closed/removed reported content ----------
-- 0004 gave moderators update/delete on posts but posts_read still only
-- special-cased is_admin(), so a moderator's /admin queue showed null targets
-- for anything not active. can_moderate() covers admins too.
drop policy if exists posts_read on posts;
create policy posts_read on posts for select using (
  (status = 'active' and (expires_at is null or expires_at > now()))
  or author_id = auth.uid()
  or can_moderate()
);
