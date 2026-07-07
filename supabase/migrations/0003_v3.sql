-- Desi GR Hub v3: events + newcomer guide (admin-managed), post images + edit tracking.
-- Apply AFTER 0001 and 0002. Reuses the is_admin() helper from 0001.

-- ---------- events (admin-managed; was data/events.ts) ----------
create table events (
  id uuid primary key default gen_random_uuid(),
  title text not null check (char_length(title) between 3 and 160),
  description text not null check (char_length(description) between 1 and 4000),
  event_date date not null,
  event_time text,                 -- freeform display time, e.g. "5:00 PM"
  location text not null,
  map_url text,
  rsvp_url text,
  created_at timestamptz not null default now()
);
create index events_date_idx on events (event_date);

-- ---------- newcomer guide (admin-managed; was data/newcomers.ts) ----------
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
  url text,
  sort_order int not null default 0,
  created_at timestamptz not null default now()
);
create index newcomer_entries_section_idx on newcomer_entries (section_id, sort_order);

-- ---------- posts: images + edit tracking ----------
alter table posts add column image_urls text[] not null default '{}'
  check (array_length(image_urls, 1) is null or array_length(image_urls, 1) <= 4);
alter table posts add column updated_at timestamptz;

-- ---------- RLS: public read, admin write (mirrors is_admin() from 0001) ----------
alter table events            enable row level security;
alter table newcomer_sections enable row level security;
alter table newcomer_entries  enable row level security;

create policy events_read   on events for select using (true);
create policy events_write  on events for all using (is_admin()) with check (is_admin());

create policy sections_read  on newcomer_sections for select using (true);
create policy sections_write on newcomer_sections for all using (is_admin()) with check (is_admin());

create policy entries_read  on newcomer_entries for select using (true);
create policy entries_write on newcomer_entries for all using (is_admin()) with check (is_admin());

-- ---------- Storage: post-images bucket (public read, own-folder writes) ----------
insert into storage.buckets (id, name, public)
values ('post-images', 'post-images', true)
on conflict (id) do nothing;

-- Anyone can view; authenticated users manage only files under their own {uid}/ prefix;
-- admins can delete any (moderation). (storage.foldername(name))[1] = top folder = uid.
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

-- ---------- Seed: events (from data/events.ts) ----------
insert into events (title, description, event_date, event_time, location, map_url) values
  ('India Independence Day Potluck 🇮🇳',
   'Celebrate India''s Independence Day with the Desi GR Hub community. Bring a dish to share, meet fellow desis, and enjoy an evening by the river. Families welcome.',
   '2026-08-15', '5:00 PM', 'Riverside Park, Grand Rapids, MI',
   'https://maps.google.com/?q=Riverside+Park+Grand+Rapids+MI'),
  ('Summer Newcomers Meet & Greet',
   'A casual get-together to welcome folks new to Grand Rapids. Ask questions about housing, groceries, jobs, and settling in, and connect with people who''ve been here a while.',
   '2026-06-21', '4:00 PM', 'Downtown Market, Grand Rapids, MI',
   'https://maps.google.com/?q=Downtown+Market+Grand+Rapids+MI');

-- Newcomer sections/entries: seed the first section here as a template; the rest are
-- added via the in-site admin UI (data/newcomers.ts remains the reference copy).
insert into newcomer_sections (slug, title, intro, sort_order) values
  ('groceries-restaurants', 'Desi Groceries & Restaurants',
   'Where to find Indian and South Asian groceries, spices, and food around Grand Rapids.', 0);
