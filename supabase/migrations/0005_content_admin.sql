-- Desi GR Hub v5: admin-managed content (announcements, FAQs, guidelines, safety disclaimers, businesses).
-- Apply AFTER 0001, 0002, 0003, 0004. Reuses is_admin() helper from 0001.

-- ---------- announcements (site-wide updates) ----------
create table announcements (
  id uuid primary key default gen_random_uuid(),
  date date not null,
  title text not null check (char_length(title) between 1 and 160),
  body text not null check (char_length(body) between 1 and 2000),
  created_at timestamptz not null default now()
);
create index announcements_date_idx on announcements (date desc);

-- ---------- faqs ----------
create table faqs (
  id uuid primary key default gen_random_uuid(),
  question text not null check (char_length(question) between 1 and 300),
  answer text not null check (char_length(answer) between 1 and 2000),
  sort_order int not null default 0,
  created_at timestamptz not null default now()
);
create index faqs_sort_idx on faqs (sort_order);

-- ---------- guidelines ----------
create table guidelines (
  id uuid primary key default gen_random_uuid(),
  title text not null check (char_length(title) between 1 and 100),
  detail text not null check (char_length(detail) between 1 and 500),
  sort_order int not null default 0,
  created_at timestamptz not null default now()
);
create index guidelines_sort_idx on guidelines (sort_order);

-- ---------- safety_disclaimers (for /safety page list; footer + community disclaimer stay hardcoded) ----------
create table safety_disclaimers (
  id uuid primary key default gen_random_uuid(),
  text text not null check (char_length(text) between 10 and 500),
  sort_order int not null default 0,
  created_at timestamptz not null default now()
);
create index safety_disclaimers_sort_idx on safety_disclaimers (sort_order);

-- ---------- businesses (community directory) ----------
create table businesses (
  id uuid primary key default gen_random_uuid(),
  name text not null check (char_length(name) between 1 and 120),
  category text not null check (category in ('Food','Services','Real Estate','Retail','Health','Other')),
  description text not null check (char_length(description) between 1 and 500),
  contact_url text not null,
  contact_label text not null,
  created_at timestamptz not null default now()
);

-- ---------- RLS: public read, admin-only write (mirrors 0003 pattern) ----------
alter table announcements enable row level security;
alter table faqs enable row level security;
alter table guidelines enable row level security;
alter table safety_disclaimers enable row level security;
alter table businesses enable row level security;

create policy announcements_read on announcements for select using (true);
create policy announcements_write on announcements for all using (is_admin()) with check (is_admin());

create policy faqs_read on faqs for select using (true);
create policy faqs_write on faqs for all using (is_admin()) with check (is_admin());

create policy guidelines_read on guidelines for select using (true);
create policy guidelines_write on guidelines for all using (is_admin()) with check (is_admin());

create policy safety_disclaimers_read on safety_disclaimers for select using (true);
create policy safety_disclaimers_write on safety_disclaimers for all using (is_admin()) with check (is_admin());

create policy businesses_read on businesses for select using (true);
create policy businesses_write on businesses for all using (is_admin()) with check (is_admin());

-- ---------- Seed: port current content from data/*.ts files ----------
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
