# v2 Community Board — setup

The community board (Q&A, housing, marketplace) needs a free Supabase project +
Google OAuth. Everything else is already in the repo. ~15 minutes, all free tiers.

## 1. Create a Supabase project
1. Sign up at https://supabase.com → **New project** (free tier).
2. Pick a region close to Michigan (e.g. `us-east-1`).
3. Save the database password somewhere.

## 2. Apply the schema
Two options:
- **SQL editor (easiest):** open the project's SQL editor, paste all of
  `supabase/migrations/0001_init.sql`, and run it.
- **CLI:** `npx supabase link --project-ref <ref>` then `npx supabase db push`.

This creates the tables, RLS policies, and triggers (auto-profile on signup,
post rate-limit, vote scoring).

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

## 6. Make yourself an admin (for moderation)
After signing in once, in the Supabase **SQL editor**:
```sql
update profiles set is_admin = true where id = (
  select id from auth.users where email = 'you@example.com'
);
```
Admins can delete/close any post and read reports.

## 7. Deploy to Vercel
- Add the same three env vars in **Vercel → Project → Settings → Environment Variables**.
- Update **Site URL** + **Redirect URLs** in Supabase to your production domain.
- Vercel Hobby is free but **non-commercial** — keep the board free/no-ads or upgrade to Pro.

## Notes
- Without env vars, the site still builds and all static pages work; the community
  section simply shows empty/sign-in states (fetches are guarded).
- Free-tier Supabase pauses after ~1 week of no activity (first request then cold-starts).
- Listings auto-expire after 30 days (filtered at read time — no cleanup job needed).
