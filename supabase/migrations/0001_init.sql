-- Desi GR Hub v2 — community board schema, RLS, and triggers.
-- Apply with the Supabase CLI (`supabase db push`) or paste into the SQL editor.
-- One unified `posts` table (type discriminator) + answers, votes, reports, profiles.

-- ---------- enums ----------
create type post_type as enum ('question', 'housing', 'marketplace');
create type post_status as enum ('active', 'closed', 'removed');
create type target_kind as enum ('post', 'answer');

-- ---------- profiles (public mirror of auth.users + admin flag) ----------
create table profiles (
  id uuid primary key references auth.users(id) on delete cascade,
  display_name text,
  avatar_url text,
  is_admin boolean not null default false,
  created_at timestamptz not null default now()
);

-- ---------- posts (questions + housing + marketplace) ----------
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
  created_at timestamptz not null default now(),
  expires_at timestamptz              -- null = never (questions); listings default +30d
);
create index posts_type_created_idx on posts (type, created_at desc);
create index posts_type_score_idx on posts (type, score desc);
create index posts_author_idx on posts (author_id);

-- ---------- answers (Q&A) ----------
create table answers (
  id uuid primary key default gen_random_uuid(),
  post_id uuid not null references posts(id) on delete cascade,
  body text not null check (char_length(body) between 1 and 8000),
  author_id uuid not null references profiles(id) on delete cascade,  -- FK to profiles for author embed
  score int not null default 0,
  created_at timestamptz not null default now()
);
create index answers_post_idx on answers (post_id, score desc);

-- ---------- votes (unique per voter+target) ----------
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

-- ---------- reports (moderation queue) ----------
create table reports (
  id uuid primary key default gen_random_uuid(),
  target_type target_kind not null,
  target_id uuid not null,
  reporter_id uuid not null references auth.users(id) on delete cascade,
  reason text,
  created_at timestamptz not null default now()
);

-- ---------- helper: is the current user an admin? ----------
-- security definer + own search_path avoids RLS recursion on profiles.
create function is_admin() returns boolean
  language sql security definer stable set search_path = public as $$
  select coalesce((select is_admin from profiles where id = auth.uid()), false);
$$;

-- ---------- trigger: auto-create a profile on signup ----------
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

-- ---------- trigger: rate-limit posts (max 10/day/user) ----------
-- ponytail: simple count-in-window guard. Upgrade to a token bucket if abused.
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

-- ---------- trigger: maintain denormalized vote score ----------
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

-- ---------- Row-Level Security ----------
alter table profiles enable row level security;
alter table posts    enable row level security;
alter table answers  enable row level security;
alter table votes    enable row level security;
alter table reports  enable row level security;

-- profiles: world-readable; a user edits only their own row.
create policy profiles_read   on profiles for select using (true);
create policy profiles_update on profiles for update using (id = auth.uid());

-- posts: anyone can read active & unexpired; authors/admins see their own + removed.
create policy posts_read on posts for select using (
  (status = 'active' and (expires_at is null or expires_at > now()))
  or author_id = auth.uid()
  or is_admin()
);
create policy posts_insert on posts for insert with check (author_id = auth.uid());
create policy posts_update on posts for update using (author_id = auth.uid() or is_admin());
create policy posts_delete on posts for delete using (author_id = auth.uid() or is_admin());

-- answers: world-readable; author owns writes; admins moderate.
create policy answers_read   on answers for select using (true);
create policy answers_insert on answers for insert with check (author_id = auth.uid());
create policy answers_update on answers for update using (author_id = auth.uid() or is_admin());
create policy answers_delete on answers for delete using (author_id = auth.uid() or is_admin());

-- votes: readable (for counts); a user manages only their own vote.
create policy votes_read   on votes for select using (true);
create policy votes_insert on votes for insert with check (voter_id = auth.uid());
create policy votes_update on votes for update using (voter_id = auth.uid());
create policy votes_delete on votes for delete using (voter_id = auth.uid());

-- reports: anyone logged in can file; only admins can read them.
create policy reports_insert on reports for insert with check (reporter_id = auth.uid());
create policy reports_read   on reports for select using (is_admin());
