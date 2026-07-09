-- Desi GR Hub — complete database schema, single file.
-- Squashed from the original incremental migrations 0001–0008 (see git history
-- for the step-by-step evolution). Run ONCE on a fresh Supabase project:
-- paste into the SQL editor, or `npx supabase db push`.
--
-- A database that already applied the old 0001–0008 files is at exactly this
-- state — do NOT re-run this file there.

-- ═══════════════════════ enums ═══════════════════════
create type post_type as enum ('question', 'housing', 'marketplace');
create type post_status as enum ('active', 'closed', 'removed');
create type target_kind as enum ('post', 'answer');

-- ═══════════════════════ tables ═══════════════════════

-- profiles: public mirror of auth.users + role flags.
create table profiles (
  id uuid primary key references auth.users(id) on delete cascade,
  display_name text,
  avatar_url text,
  is_admin boolean not null default false,
  can_moderate_reports boolean not null default false,
  notify_on_report boolean not null default false,
  created_at timestamptz not null default now()
);

-- posts: questions + housing + marketplace (type discriminator).
create table posts (
  id uuid primary key default gen_random_uuid(),
  type post_type not null,
  category text,
  title text not null check (char_length(title) between 3 and 160),
  body text not null check (char_length(body) between 1 and 8000),
  author_id uuid not null references profiles(id) on delete cascade,  -- FK to profiles so PostgREST can embed author
  contact text,                       -- wa.me link / phone / "reply in the group"
  price numeric,                      -- marketplace price / housing rent (nullable)
  location text,
  status post_status not null default 'active',
  score int not null default 0,       -- denormalized vote sum (Q&A ranking)
  details jsonb not null default '{}'::jsonb,  -- type-specific extras
  image_urls text[] not null default '{}'
    check (array_length(image_urls, 1) is null or array_length(image_urls, 1) <= 4),
  updated_at timestamptz,             -- set on edit (24h edit window)
  created_at timestamptz not null default now(),
  expires_at timestamptz              -- null = never (questions); listings default +30d
);
create index posts_type_created_idx on posts (type, created_at desc);
create index posts_type_score_idx on posts (type, score desc);
create index posts_author_idx on posts (author_id);

-- answers (Q&A).
create table answers (
  id uuid primary key default gen_random_uuid(),
  post_id uuid not null references posts(id) on delete cascade,
  body text not null check (char_length(body) between 1 and 8000),
  author_id uuid not null references profiles(id) on delete cascade,
  score int not null default 0,
  created_at timestamptz not null default now()
);
create index answers_post_idx on answers (post_id, score desc);

-- votes: unique per voter+target; score is denormalized onto posts/answers.
create table votes (
  id uuid primary key default gen_random_uuid(),
  target_type target_kind not null,
  target_id uuid not null,
  voter_id uuid not null references auth.users(id) on delete cascade,
  value smallint not null check (value in (-1, 1)),
  created_at timestamptz not null default now(),
  unique (voter_id, target_type, target_id)
);
create index votes_target_idx on votes (target_type, target_id);

-- reports: moderation queue. One report per user per target.
create table reports (
  id uuid primary key default gen_random_uuid(),
  target_type target_kind not null,
  target_id uuid not null,
  reporter_id uuid not null references auth.users(id) on delete cascade,
  reason text,
  status text not null default 'open' check (status in ('open', 'resolved')),
  created_at timestamptz not null default now(),
  unique (reporter_id, target_type, target_id)
);
create index reports_status_created_idx on reports (status, created_at desc);

-- events: admin-managed (was data/events.ts).
create table events (
  id uuid primary key default gen_random_uuid(),
  title text not null check (char_length(title) between 3 and 160),
  description text not null check (char_length(description) between 1 and 4000),
  event_date date not null,
  event_time text,                 -- freeform display time, e.g. "5:00 PM"
  location text not null,
  map_url text check (map_url is null or map_url ~ '^https?://'),
  rsvp_url text check (rsvp_url is null or rsvp_url ~ '^https?://'),
  created_at timestamptz not null default now()
);
create index events_date_idx on events (event_date);

-- newcomer guide: admin-managed (was data/newcomers.ts).
create table newcomer_sections (
  id uuid primary key default gen_random_uuid(),
  slug text not null,
  title text not null,
  intro text not null default '',
  sort_order int not null default 0,
  created_at timestamptz not null default now()
);
create table newcomer_entries (
  id uuid primary key default gen_random_uuid(),
  section_id uuid not null references newcomer_sections(id) on delete cascade,
  name text not null,
  detail text not null,
  url text check (url is null or url ~ '^https?://'),
  sort_order int not null default 0,
  created_at timestamptz not null default now()
);
create index newcomer_entries_section_idx on newcomer_entries (section_id, sort_order);

-- announcements: admin-managed site-wide updates.
create table announcements (
  id uuid primary key default gen_random_uuid(),
  date date not null,
  title text not null check (char_length(title) between 1 and 160),
  body text not null check (char_length(body) between 1 and 2000),
  created_at timestamptz not null default now()
);
create index announcements_date_idx on announcements (date desc);

-- faqs: admin-managed.
create table faqs (
  id uuid primary key default gen_random_uuid(),
  question text not null check (char_length(question) between 1 and 300),
  answer text not null check (char_length(answer) between 1 and 2000),
  sort_order int not null default 0,
  created_at timestamptz not null default now()
);
create index faqs_sort_idx on faqs (sort_order);

-- guidelines: admin-managed.
create table guidelines (
  id uuid primary key default gen_random_uuid(),
  title text not null check (char_length(title) between 1 and 100),
  detail text not null check (char_length(detail) between 1 and 500),
  sort_order int not null default 0,
  created_at timestamptz not null default now()
);
create index guidelines_sort_idx on guidelines (sort_order);

-- safety_disclaimers: the /safety page list (footer + community disclaimers stay hardcoded).
create table safety_disclaimers (
  id uuid primary key default gen_random_uuid(),
  text text not null check (char_length(text) between 10 and 500),
  sort_order int not null default 0,
  created_at timestamptz not null default now()
);
create index safety_disclaimers_sort_idx on safety_disclaimers (sort_order);

-- businesses: admin-curated community directory.
create table businesses (
  id uuid primary key default gen_random_uuid(),
  name text not null check (char_length(name) between 1 and 120),
  category text not null check (category in ('Food','Services','Real Estate','Retail','Health','Other')),
  description text not null check (char_length(description) between 1 and 500),
  contact_url text not null check (contact_url ~ '^https?://'),
  contact_label text not null,
  created_at timestamptz not null default now()
);

-- ═══════════════════════ functions ═══════════════════════

-- Is the current user an admin? security definer + own search_path avoids
-- RLS recursion on profiles.
create function is_admin() returns boolean
  language sql security definer stable set search_path = public as $$
  select coalesce((select is_admin from profiles where id = auth.uid()), false);
$$;

-- Can the current user moderate reports? Admin, or explicit moderator flag.
create function can_moderate() returns boolean
  language sql security definer stable set search_path = public as $$
  select coalesce(
    (select is_admin or can_moderate_reports from profiles where id = auth.uid()),
    false
  );
$$;

-- Admin-only: look up a user's UUID by email (team management page).
create function find_user_id_by_email(lookup_email text) returns uuid
  language sql security definer stable set search_path = public as $$
  select case when is_admin() then (select id from auth.users where email = lookup_email) end;
$$;

-- Admin-only: user id → email pairs for the /admin user list.
create function list_user_emails() returns table (id uuid, email text)
  language sql security definer stable set search_path = public as $$
  select u.id, u.email::text from auth.users u where is_admin();
$$;

-- Auto-create a profile on signup.
create function handle_new_user() returns trigger
  language plpgsql security definer set search_path = public as $$
begin
  insert into profiles (id, display_name, avatar_url)
  values (
    new.id,
    coalesce(new.raw_user_meta_data->>'full_name',
             new.raw_user_meta_data->>'name',
             split_part(new.email, '@', 1)),
    new.raw_user_meta_data->>'avatar_url'
  );
  return new;
end;
$$;
create trigger on_auth_user_created
  after insert on auth.users
  for each row execute function handle_new_user();

-- Block self-promotion: profiles_update RLS lets users update their own row,
-- and RLS has no column-level control — without this trigger any signed-in
-- user could PATCH their own row via PostgREST and set is_admin = true.
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

-- Rate limits. ponytail: simple count-in-window guards; upgrade to a token
-- bucket if abused.
create function enforce_post_rate_limit() returns trigger
  language plpgsql security definer set search_path = public as $$
declare recent int;
begin
  select count(*) into recent from posts
   where author_id = new.author_id and created_at > now() - interval '1 day';
  if recent >= 10 then
    raise exception 'Rate limit reached: max 10 posts per day.';
  end if;
  return new;
end;
$$;
create trigger posts_rate_limit before insert on posts
  for each row execute function enforce_post_rate_limit();

create function enforce_answer_rate_limit() returns trigger
  language plpgsql security definer set search_path = public as $$
declare recent int;
begin
  select count(*) into recent from answers
   where author_id = new.author_id and created_at > now() - interval '1 day';
  if recent >= 30 then
    raise exception 'Rate limit reached: max 30 answers per day.';
  end if;
  return new;
end;
$$;
create trigger answers_rate_limit before insert on answers
  for each row execute function enforce_answer_rate_limit();

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

-- Maintain the denormalized vote score on posts/answers.
create function apply_vote_delta() returns trigger
  language plpgsql security definer set search_path = public as $$
declare d int;
begin
  if (tg_op = 'INSERT') then d := new.value;
  elsif (tg_op = 'DELETE') then d := -old.value;
  else d := new.value - old.value;
  end if;

  if (coalesce(new.target_type, old.target_type) = 'post') then
    update posts set score = score + d where id = coalesce(new.target_id, old.target_id);
  else
    update answers set score = score + d where id = coalesce(new.target_id, old.target_id);
  end if;
  return null;
end;
$$;
create trigger votes_apply_delta
  after insert or update or delete on votes
  for each row execute function apply_vote_delta();

-- ═══════════════════════ Row-Level Security ═══════════════════════
alter table profiles           enable row level security;
alter table posts              enable row level security;
alter table answers            enable row level security;
alter table votes              enable row level security;
alter table reports            enable row level security;
alter table events             enable row level security;
alter table newcomer_sections  enable row level security;
alter table newcomer_entries   enable row level security;
alter table announcements      enable row level security;
alter table faqs               enable row level security;
alter table guidelines         enable row level security;
alter table safety_disclaimers enable row level security;
alter table businesses         enable row level security;

-- profiles: world-readable; users edit their own row, admins edit anyone's
-- (role columns are guarded by the protect_privileged_columns trigger).
create policy profiles_read   on profiles for select using (true);
create policy profiles_update on profiles for update
  using (id = auth.uid() or is_admin())
  with check (id = auth.uid() or is_admin());

-- posts: anyone reads active & unexpired; authors and moderators see the rest.
create policy posts_read on posts for select using (
  (status = 'active' and (expires_at is null or expires_at > now()))
  or author_id = auth.uid()
  or can_moderate()
);
create policy posts_insert on posts for insert with check (author_id = auth.uid());
create policy posts_update on posts for update
  using (author_id = auth.uid() or can_moderate())
  with check (author_id = auth.uid() or can_moderate());
create policy posts_delete on posts for delete
  using (author_id = auth.uid() or can_moderate());

-- answers: world-readable; author owns writes; moderators moderate.
create policy answers_read   on answers for select using (true);
create policy answers_insert on answers for insert with check (author_id = auth.uid());
create policy answers_update on answers for update
  using (author_id = auth.uid() or can_moderate())
  with check (author_id = auth.uid() or can_moderate());
create policy answers_delete on answers for delete
  using (author_id = auth.uid() or can_moderate());

-- votes: a user reads and manages only their own votes (scores are
-- denormalized, nothing needs to read others' votes).
create policy votes_read   on votes for select using (voter_id = auth.uid());
create policy votes_insert on votes for insert with check (voter_id = auth.uid());
create policy votes_update on votes for update using (voter_id = auth.uid());
create policy votes_delete on votes for delete using (voter_id = auth.uid());

-- reports: anyone logged in can file; moderators read and resolve.
create policy reports_insert on reports for insert with check (reporter_id = auth.uid());
create policy reports_read   on reports for select using (can_moderate());
create policy reports_update on reports for update
  using (can_moderate())
  with check (can_moderate());

-- Admin-managed content: public read, admin-only write.
create policy events_read  on events for select using (true);
create policy events_write on events for all using (is_admin()) with check (is_admin());

create policy sections_read  on newcomer_sections for select using (true);
create policy sections_write on newcomer_sections for all using (is_admin()) with check (is_admin());

create policy entries_read  on newcomer_entries for select using (true);
create policy entries_write on newcomer_entries for all using (is_admin()) with check (is_admin());

create policy announcements_read  on announcements for select using (true);
create policy announcements_write on announcements for all using (is_admin()) with check (is_admin());

create policy faqs_read  on faqs for select using (true);
create policy faqs_write on faqs for all using (is_admin()) with check (is_admin());

create policy guidelines_read  on guidelines for select using (true);
create policy guidelines_write on guidelines for all using (is_admin()) with check (is_admin());

create policy safety_disclaimers_read  on safety_disclaimers for select using (true);
create policy safety_disclaimers_write on safety_disclaimers for all using (is_admin()) with check (is_admin());

create policy businesses_read  on businesses for select using (true);
create policy businesses_write on businesses for all using (is_admin()) with check (is_admin());

-- ═══════════════════════ Storage: post images ═══════════════════════
-- Public read; authenticated users manage only files under their own {uid}/
-- prefix; admins can delete any (moderation).
insert into storage.buckets (id, name, public)
values ('post-images', 'post-images', true)
on conflict (id) do nothing;

create policy post_images_read on storage.objects for select
  using (bucket_id = 'post-images');
create policy post_images_insert on storage.objects for insert to authenticated
  with check (bucket_id = 'post-images' and (storage.foldername(name))[1] = auth.uid()::text);
create policy post_images_update on storage.objects for update to authenticated
  using (bucket_id = 'post-images' and (storage.foldername(name))[1] = auth.uid()::text);
create policy post_images_delete on storage.objects for delete to authenticated
  using (
    bucket_id = 'post-images'
    and ((storage.foldername(name))[1] = auth.uid()::text or is_admin())
  );

-- ═══════════════════════ Seed data ═══════════════════════
-- Starter content ported from the original data/*.ts files. Edit or replace
-- it in-site after bootstrapping your first admin (SETUP.md).

insert into events (title, description, event_date, event_time, location, map_url) values
  ('India Independence Day Potluck 🇮🇳',
   'Celebrate India''s Independence Day with the Desi GR Hub community. Bring a dish to share, meet fellow desis, and enjoy an evening by the river. Families welcome.',
   '2026-08-15', '5:00 PM', 'Riverside Park, Grand Rapids, MI',
   'https://maps.google.com/?q=Riverside+Park+Grand+Rapids+MI'),
  ('Summer Newcomers Meet & Greet',
   'A casual get-together to welcome folks new to Grand Rapids. Ask questions about housing, groceries, jobs, and settling in, and connect with people who''ve been here a while.',
   '2026-06-21', '4:00 PM', 'Downtown Market, Grand Rapids, MI',
   'https://maps.google.com/?q=Downtown+Market+Grand+Rapids+MI');

-- Newcomer sections/entries: first section as a template; add the rest via
-- the in-site admin UI (data/newcomers.ts remains the reference copy).
insert into newcomer_sections (slug, title, intro, sort_order) values
  ('groceries-restaurants', 'Desi Groceries & Restaurants',
   'Where to find Indian and South Asian groceries, spices, and food around Grand Rapids.', 0);

insert into announcements (date, title, body) values
  ('2026-07-05', 'Website launched! 🎉', 'The Desi GR Hub website is live. Browse the groups, read the guidelines, check the Newcomer''s Guide to Grand Rapids, and share the link with friends who''d love to join the community.');

insert into faqs (question, answer, sort_order) values
  ('How do I join the community?', 'Tap any "Join Community" button on this site to open the main Desi GR Hub in WhatsApp, then join. From there you can add the specific groups you need, like rides or accommodation.', 0),
  ('Is it free to join?', 'Yes, completely free. Desi GR Hub is a volunteer-run community for Indian and South Asian folks in Grand Rapids and West Michigan, there are no fees to join any group.', 1),
  ('Which group do I use for rides or carpooling?', 'Use GR Rides & Help for Grand Rapids and Kalamazoo Rides for the Kalamazoo area. Post where you''re going and when, and connect with others heading the same way.', 2),
  ('Which group is for housing or roommates?', 'GR Accommodation Hub is for finding or offering housing and roommates in Grand Rapids, MI and across the state. Keep posts to accommodation only.', 3),
  ('Where can I buy, sell, or promote my business?', 'GR Promotions & Marketplace is the only group for ads, promotions, and selling items. Posting business content in other groups isn''t allowed.', 4),
  ('Which group should I use for general questions?', 'Community Q&A is the place to ask and answer questions about anything, settling into Grand Rapids, local recommendations, or everyday life.', 5),
  ('What are some ride safety tips?', 'Only ride with people you''re comfortable with, confirm pickup details in advance, share your plans with a friend, and remember the rides groups are community help, not an official service.', 6),
  ('How do I avoid accommodation scams?', 'Never send money before verifying a listing and the person. Video-call to see the place, be wary of deals that seem too good, avoid wiring deposits to strangers, and report anything suspicious to the admins.', 7),
  ('How do I report a problem or a bad actor?', 'Message an admin directly in WhatsApp, or use the contact form on this site and choose "Report an issue." We take reports seriously and act to keep the community safe.', 8),
  ('How can I suggest a new group?', 'We add new groups based on community feedback. Send your idea through the contact form or message an admin, if there''s enough interest, we''ll create it.', 9),
  ('Can I promote my business in the community?', 'Yes, but only in GR Promotions & Marketplace. Keep it honest and relevant, and don''t spam. Business content in the other groups will be removed.', 10),
  ('How do I get my business listed on this website?', 'Use the contact form and pick "List my business." Our directory is community-curated, so an admin will review your request before adding your listing.', 11);

insert into guidelines (title, detail, sort_order) values
  ('Be Respectful', 'Treat everyone with kindness and professionalism. No harassment, hate speech, or disrespect of any kind.', 0),
  ('Stay Relevant', 'Use the appropriate group for each need. Keep unrelated content and spam out of the groups.', 1),
  ('Protect Privacy', 'Don''t share sensitive personal information, phone numbers, addresses, or financial details, unless absolutely necessary.', 2),
  ('Help Responsibly', 'Share accurate, genuine information. Misleading claims will be removed.', 3),
  ('Report Issues', 'Notify the admins about any inappropriate content or behavior so we can keep the community safe.', 4),
  ('No Solicitation', 'Promotions belong only in GR Promotions & Marketplace, not in the other groups.', 5);

insert into safety_disclaimers (text, sort_order) values
  ('The admins'' role is solely to maintain and moderate the groups. The admins are not liable for any interactions, transactions, or outcomes from group activities.', 0),
  ('Participate at your own discretion.', 1),
  ('All shared information is individual contribution, not verified or professional advice.', 2),
  ('Members resolve disputes independently while staying professional and respectful.', 3),
  ('The rides groups are NOT an official rideshare service and are not affiliated with any company.', 4),
  ('Always verify accommodation listings and individuals before making agreements.', 5),
  ('Business directory listings are community-curated but not endorsed or vetted by the admins.', 6);

insert into businesses (name, category, description, contact_url, contact_label) values
  ('Sample Tiffin Service', 'Food', 'Home-style Indian tiffin and meal prep, delivered around Grand Rapids. (Sample listing, replace with a real business.)', 'https://wa.me/', 'Message on WhatsApp'),
  ('Sample Immigration & Tax Help', 'Services', 'Community member offering tax filing and paperwork help for students and newcomers. (Sample listing, replace with a real business.)', 'https://wa.me/', 'Message on WhatsApp'),
  ('Sample Realtor', 'Real Estate', 'Helping desi families buy and rent homes across West Michigan. (Sample listing, replace with a real business.)', 'https://wa.me/', 'Message on WhatsApp');
