# Development & operations

How to run, update, and publish the site. For what the project is, see [README.md](./README.md).

## Updating content

| To change… | How |
|---|---|
| A WhatsApp group (name, description, invite link) | Edit `data/groups.ts` and push to GitHub; site rebuilds within a minute |
| Site address, main hub link, contact-form ID | Edit `data/site.ts` and push to GitHub |
| **Announcements** | Visit `/announcements`, sign in as admin, and use the add/edit/delete UI (in-site, no code) |
| **FAQ questions and answers** | Visit `/faq`, sign in as admin, and use the add/edit/delete UI (in-site, no code) |
| **Guidelines** | Visit `/guidelines`, sign in as admin, and use the add/edit/delete UI (in-site, no code) |
| **Safety disclaimers** | Visit `/safety`, sign in as admin, and use the add/edit/delete UI (in-site, no code) |
| **Business directory listings** | Visit `/businesses`, sign in as admin, and use the add/edit/delete UI (in-site, no code) |
| **Events** | Visit `/events`, sign in as admin, and use the add/edit/delete UI (in-site, no code) |
| **Newcomer's Guide entries** | Visit `/newcomers`, sign in as admin, and use the add/edit/delete UI (in-site, no code) |

**Admin-managed content** (announcements, FAQs, guidelines, safety disclaimers, businesses, events, newcomer's guide) lives in the Supabase database. After signing in as an admin, each page shows an add/edit/delete interface at the top — no code required. Changes take effect within 5 minutes via ISR.

**Not in these files:** the **community board** (Q&A, housing, marketplace) is user-generated and lives in the Supabase database, not `data/`. Moderators review reported posts at `/admin` with bulk actions (dismiss/close/delete); admins can promote/demote team members at `/admin/team` and toggle email alerts — see the moderation section below. The **weather banner** and **currency converter** pull live data from free public APIs, so there's nothing to edit for them either.

## Before you go live

1. **Turn on the contact form.** Create a free form at [formspree.io](https://formspree.io), copy its form ID, and paste it into `formspreeId` in `data/site.ts`. Until you do, messages won't reach you.
2. **Set your web address.** Update `url` in `data/site.ts` to your real address (this makes your links and Google/WhatsApp previews correct).
3. **Set up Supabase** (follow [supabase/SETUP.md](./supabase/SETUP.md)) to enable the community board and admin-managed content pages. Then:
   - Sign in as an admin and add real content to **Announcements**, **FAQs**, **Guidelines**, **Safety Disclaimers**, **Businesses**, **Events**, and **Newcomer's Guide** via the in-site admin dashboards.
   - Promote other members to moderator or admin roles at `/admin/team` (admin-only).

## Community board, admin-managed content, and moderation

These features need a backend. They run on **Supabase's free tier** (database + sign-in) and still deploy free on Vercel.

- **To turn them on:** follow **[supabase/SETUP.md](./supabase/SETUP.md)** — create a free Supabase project, run all migrations (0001–0005, including `0005_content_admin.sql` for the admin-managed content), enable Google + email sign-in, and paste three keys into `.env.local` (locally) and Vercel's env settings (in production). ~15 minutes.
- **Until you do,** the site still builds and every static page works; the board, admin pages, and admin-managed content simply show sign-in / empty states.
- **Admin tasks:** make yourself an admin (one SQL line in `supabase/SETUP.md`). Then:
  - **Manage all admin content:** add/edit/delete entries directly on `/announcements`, `/faq`, `/guidelines`, `/safety`, `/businesses`, `/events`, and `/newcomers` — no code needed. Changes take effect within 5 minutes.
  - **Review reports at `/admin`:** members can report posts/answers; you see them grouped by target (post/answer) with report count and reasons. Bulk actions: dismiss reports, close posts (set `status='closed'`), or delete content. Toggle "Email me on new report" to get Formspree alerts when members file reports.
  - **Manage the team at `/admin/team`** (admin-only): promote other members by email with granular permissions — Full Admin (all privileges) or Moderator (can review reports and moderate content, but cannot manage the team or site admin functions).
- **Posts** can include up to 4 photos (compressed in the browser before upload) and are **editable for 24 hours**, after which the author deletes and reposts. Housing/marketplace listings auto-expire after the duration the poster chose (7–60 days).
- **Cost note:** Vercel's free tier is **non-commercial** — keep the board free and ad-free, or upgrade to Vercel Pro.

## Publish it (Vercel, free)

1. Push this project to GitHub.
2. Go to [vercel.com](https://vercel.com), choose **Import Project**, pick the repo, and click **Deploy**. No settings to change.
3. Once it's live, put the live address into `url` in `data/site.ts` and push again so previews are correct.
4. Forward the live link to yourself on WhatsApp to check the preview card looks right.

## Get found on Google

Add the site to [Google Search Console](https://search.google.com/search-console) (Vercel makes verification easy), then submit your sitemap at `yoursite.com/sitemap.xml`. Do the same at [Bing Webmaster Tools](https://www.bing.com/webmasters). This helps you show up for searches like "Indian community Grand Rapids" much sooner.

## Optional: your own domain

Attach a custom domain (around $10/year) in Vercel's settings. A real domain like `desigrhub.com` looks more trustworthy and tends to rank better than a `.vercel.app` address.

---

## For developers

### Stack
- **Next.js 16** (App Router) + **React 19** + **TypeScript** (strict)
- **Tailwind CSS v4** (configured in CSS via `@theme` in `app/globals.css`, no `tailwind.config.js`)
- **Static marketing pages** + a **dynamic community board** on **Supabase** (Postgres + Auth, free tier; `@supabase/supabase-js` + `@supabase/ssr`, no ORM). Contact form via `@formspree/react`. Build-time QR codes via `qrcode`. Live weather/FX via free keyless public APIs, fetched client-side.

### Commands
```bash
npm install
cp .env.example .env.local   # then fill Supabase keys (community board — see supabase/SETUP.md)
npm run dev        # http://localhost:3000
npm run build      # production build; must pass before deploying
npm run lint
```

### Architecture
- Static content in typed `data/` files (typed by `lib/types.ts`); pages in `app/`, shared UI in `components/`.
- Server Components by default; `"use client"` only where browser APIs are needed: mobile menu, copy-link button, contact form, the weather/currency live islands, and a few board components (`AuthButtons`, forms).
- Marketing pages are statically generated (group detail pages use `generateStaticParams`; QR codes render to SVG at build time). The board (`/community/*`, `/account`), admin pages (`/admin`, `/admin/team`), admin-managed content pages (`/announcements`, `/faq`, `/guidelines`, `/safety`, `/businesses`, `/events`, `/newcomers`), and event/content management are server-rendered on demand with ISR (5-minute revalidation).
- **Supabase-backed features:** Supabase Auth (Google OAuth + email magic link); **Row-Level Security** is the authorization layer (policies in migrations `0001_init.sql`, `0003_v3.sql`, `0004_admin_moderation.sql`, `0005_content_admin.sql`); mutations via **server actions** (`app/community/actions.ts`, `app/admin-actions.ts`, each re-checks auth); session refreshed in **`proxy.ts`**. Data reads in `lib/queries.ts`, board constants in `lib/community.ts`, Supabase clients in `lib/supabase/`. Email notifications sent best-effort via `lib/notify.ts` (Formspree integration). Admin-managed content uses native `<details>/<summary>` for UI toggles (no JS state, ponytail pattern).
- SEO: per-page metadata + JSON-LD (Organization + WebSite on home, FAQPage on `/faq`, Event on `/events`, BreadcrumbList on group pages, **QAPage on question detail pages**), `sitemap.ts` (appends question URLs), `robots.ts`, generated `opengraph-image`. Board listings (housing/marketplace) are `noindex`.
- **Next 16 gotchas:** route `params`/`searchParams` are Promises (`await` them); **middleware is now `proxy.ts`**; `cookies()` is async; Tailwind's gradient utility is `bg-linear-to-*`.

See [AGENTS.md](./AGENTS.md) for the full architecture, conventions, and content recipes (also used by AI coding agents).
