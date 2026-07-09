# Supabase setup — community board + admin-managed content

The community board (Q&A, housing, marketplace) + admin-managed content (Announcements, FAQs, Guidelines, Safety Disclaimers, Businesses, Events, Newcomer's Guide) need a free Supabase project + Google OAuth. Everything else is already in the repo. ~15 minutes, all free tiers.

## 1. Create a Supabase project
1. Sign up at https://supabase.com → **New project** (free tier).
2. Pick a region close to Michigan (e.g. `us-east-1`).
3. Save the database password somewhere.

## 2. Apply the schema
The whole schema is **one file**: `supabase/migrations/0001_schema.sql`. Run it once:
- **SQL editor (easiest):** open the project's SQL editor, paste the file, run it.
- **CLI:** `npx supabase link --project-ref <ref>` then `npx supabase db push`.

This creates everything:
- **Community board**: posts, answers, votes, reports — with RLS, rate limits (10 posts / 30 answers / 20 reports per day per user), vote-score triggers, one-report-per-user-per-target, and auto-profile on signup.
- **Admin-managed content**: events, newcomer guide, announcements, FAQs, guidelines, safety disclaimers, businesses — public read, admin-only write, seeded with starter content you edit in-site.
- **Moderation & roles**: `is_admin` / `can_moderate_reports` flags, report queue policies, and a trigger that blocks non-admins from changing role columns (RLS has no column-level control).
- **Storage**: the `post-images` bucket + access policies (create the bucket manually if your project blocks `insert into storage.buckets`).

(The schema evolved as incremental migrations `0001`–`0008` during development; see git history if you need the step-by-step record.)

## 3. Get your API keys
Project → **Settings → API**. Copy:
- **Project URL** → `NEXT_PUBLIC_SUPABASE_URL`
- **anon public** key → `NEXT_PUBLIC_SUPABASE_ANON_KEY`
- **service_role** key → `SUPABASE_SERVICE_ROLE_KEY` (keep secret)

Create `.env.local` in the project root (copy `.env.example`) and fill these in.

## 4. Enable auth providers
Project → **Authentication → Providers**:
- **Email**: enable (magic link works out of the box).
- **Google**:
  1. Create an OAuth client at https://console.cloud.google.com/apis/credentials
     → *OAuth client ID* → *Web application*.
  2. Under **Authorized redirect URIs** add:
     `https://<your-project>.supabase.co/auth/v1/callback`
  3. Paste the Google **Client ID** + **Client Secret** into Supabase's Google provider.

Project → **Authentication → URL Configuration**:
- **Site URL**: `http://localhost:3000` for dev (and your Vercel URL in prod).
- **Redirect URLs**: add `http://localhost:3000/**` and `https://<your-vercel-domain>/**`.

## 5. Run it
```
npm run dev
```
Go to `/community`, sign in via `/account`, and post.

## 6. Bootstrap the first admin (for moderation)
After signing in once, in the Supabase **SQL editor**:
```sql
update profiles set is_admin = true where id = (
  select id from auth.users where email = 'you@example.com'
);
```
**Full admin** (`is_admin = true`): can delete/close any post, read/dismiss reports, and manage the team at `/admin/team` (promote/demote other admins/moderators by email).

Once you're admin, use `/admin/team` to promote other users as **Moderators** (`can_moderate_reports = true`): they can review reports at `/admin` and close/delete reported content, but cannot manage the team or other site admin functions.

Both roles see the moderation queue at `/admin`, can toggle email alerts for new reports, and have a direct link from `/account`.

## 7. Deploy to Vercel
- Add the same three env vars in **Vercel → Project → Settings → Environment Variables**.
- Update **Site URL** + **Redirect URLs** in Supabase to your production domain.
- Vercel Hobby is free but **non-commercial** — keep the board free/no-ads or upgrade to Pro.

## Notes
- Without env vars, the site still builds and all pages work; the community
  section and admin-managed content pages simply show empty/sign-in states (fetches are guarded).
- Free-tier Supabase pauses after ~1 week of no activity (first request then cold-starts).
- Community board listings auto-expire after 30 days (filtered at read time — no cleanup job needed).
- Admin-managed content pages use ISR with 5-minute revalidation (changes appear within 5min on the live site).
