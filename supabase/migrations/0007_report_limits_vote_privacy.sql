-- Desi GR Hub v7: report abuse limits + vote privacy. Apply AFTER 0001–0006.

-- ---------- 1) One report per user per target ----------
-- Posts and answers are rate-limited, but reports were unlimited — and each
-- one can fire a Formspree email (free tier: ~50/month shared with the
-- contact form). Dedupe existing rows first (keep one per reporter+target).
delete from reports a using reports b
  where a.reporter_id = b.reporter_id
    and a.target_type = b.target_type
    and a.target_id = b.target_id
    and a.ctid > b.ctid;
alter table reports add constraint reports_one_per_user_per_target
  unique (reporter_id, target_type, target_id);

-- ---------- 2) Rate-limit reports (same pattern as posts/answers) ----------
create function enforce_report_rate_limit() returns trigger
  language plpgsql security definer set search_path = public as $$
declare recent int;
begin
  select count(*) into recent from reports
   where reporter_id = new.reporter_id and created_at > now() - interval '1 day';
  if recent >= 20 then
    raise exception 'Rate limit reached: max 20 reports per day.';
  end if;
  return new;
end;
$$;
create trigger reports_rate_limit before insert on reports
  for each row execute function enforce_report_rate_limit();

-- ---------- 3) Vote privacy ----------
-- votes_read was world-readable, exposing who voted on what to anyone with
-- the anon key. The app only ever reads the current user's own votes;
-- scores are denormalized onto posts/answers by trigger.
drop policy if exists votes_read on votes;
create policy votes_read on votes for select using (voter_id = auth.uid());
