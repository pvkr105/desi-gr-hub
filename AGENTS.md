<!-- BEGIN:nextjs-agent-rules -->
# This is NOT the Next.js you know

This version has breaking changes — APIs, conventions, and file structure may all differ from your training data. Read the relevant guide in `node_modules/next/dist/docs/` before writing any code. Heed deprecation notices.

Key gotchas already hit on this project:
- Route `params` and `searchParams` are **Promises** — you must `await` them.
- Middleware is renamed to **`proxy.ts`** at the project root (Next 16 — same behavior; export a `proxy` function + `config.matcher`). `cookies()` from `next/headers` is **async** — `await` it.
- Tailwind is **v4**: configured in CSS via `@theme` in `app/globals.css`, not a `tailwind.config.js`. Gradient utility is `bg-linear-to-*` (not `bg-gradient-to-*`).
<!-- END:nextjs-agent-rules -->

# Desi GR Hub — project guide

## What this is
The public website for **Desi GR Hub**, a WhatsApp community for Indian & South Asian folks in Grand Rapids and West Michigan. The site is the community's front door: it explains the community, showcases each WhatsApp group with join links + QR codes, and hosts guidelines, safety, FAQ, a Newcomer's Guide, and a business directory. It also runs a **community board** (Reddit-style Q&A + housing/roommate listings + a buy/sell marketplace) and utility tools: an **events** page, a live **currency converter**, and a Grand Rapids **weather banner**.

**Non-negotiables:** **mobile-first** (~95% of visitors are on phones via WhatsApp forwards) and **SEO-strong** (the community grows through search + shares). The **static info pages** (home, groups, FAQ, guidelines, safety, businesses, announcements, contact) stay static and free to host. The **dynamic tier is Supabase-backed** (free tier, auth + Row-Level Security): the **community board**, plus **Events** and the **Newcomer's Guide** (now admin-managed in-site, server-rendered). Keep the split clean — a *static* info page must never depend on the database.

## Architecture at a glance
- **Next.js 16 App Router + React 19 + TypeScript (strict) + Tailwind v4.**
- **Static marketing content** lives in typed files under `data/*.ts`, typed by `lib/types.ts`. **Editing that content never requires touching components.**
- Pages in `app/`, shared UI in `components/`. Server Components by default; `"use client"` only for genuine interactivity (mobile menu, `CopyLinkButton`, and the live islands below).
- Marketing pages are statically generated. QR codes render to SVG **at build time** in the `QrCode` server component (`qrcode` package). Contact form is a plain HTML POST to **Formspree** (no backend).
- **Two live client islands** fetch free, **keyless** public APIs in the browser — the HTML stays static, only the numbers hydrate: `WeatherBanner` (Open-Meteo) and the currency `ForexIndicator` / `CurrencyConverter` (fawazahmed0 rates, via `lib/rates.ts`).
- **Community board** (`/community/*`, `/account`) is the dynamic tier: **Supabase** Postgres + Auth (Google OAuth + email magic link). **Row-Level Security is the authorization layer**; mutations go through **server actions** (`app/community/actions.ts`); the session cookie is refreshed in **`proxy.ts`**. Schema + policies live in `supabase/migrations/`. Setup: `supabase/SETUP.md`.
- **Posts** support **image uploads** (≤4, compressed in-browser via `lib/image.ts` → the `post-images` Storage bucket; URLs allow-listed server-side) and a **24h edit window** (`canEdit` in `lib/community.ts`, `editPost` action); a **disclaimer modal** gates posting. When a post/answer is reported, it goes into the **moderation queue** viewable at `/admin` (gated by `is_admin` or `can_moderate_reports`).
- **Events** + the **Newcomer's Guide** are admin-managed in-site via `app/admin-actions.ts` (gated by `is_admin`), rendered by `EventAdmin` / `NewcomerAdmin`.
- **Admin dashboard** (`/admin`, `/admin/team`) lets moderators review reported content and bulk-moderate (dismiss/close/delete), and full admins manage team permissions. Admins can toggle email notifications (one shared inbox via Formspree when any moderator has it on). Team management (`/admin/team`, admin-only) lets you promote/demote users by email with per-user `is_admin` and `can_moderate_reports` toggles.

```
app/            static info pages + sitemap.ts, robots.ts, opengraph-image.tsx, not-found.tsx, error.tsx, goodbye/
  community/    board: landing, [type] list, [type]/[id] detail (+ /edit), new, loading.tsx, actions.ts   ← DB-backed
  events/, newcomers/  ← DB-backed, admin CRUD (ISR)
  admin/        moderation dashboard, team management (reports + moderators)   ← DB-backed, moderator/admin
  account/      sign-in / profile
  auth/callback/ OAuth + magic-link code exchange (route handler)
  admin-actions.ts  admin/moderator server actions (events, newcomers, reports, team)
components/      Header, Footer, StickyJoinBar, JoinButton, GroupCard, BusinessCard, QrCode, LogoMark,
                CopyLinkButton, PageHeader, JsonLd, WeatherBanner, ForexIndicator, CurrencyConverter, AuthNav,
                ContributeBanner, SignedOutOnly, EventAdmin, NewcomerAdmin
  community/    PostCard, PostForm, VoteButtons, ReportButton, AnswerList, AnswerForm, AuthButtons
data/           groups, faqs, announcements, guidelines, safety, businesses, site  ← edit these
                (events, newcomers remain only as DB seed/reference)
lib/            types.ts (all interfaces), rates.ts (FX fetch), community.ts (board constants + edit window/images),
                image.ts (browser compress), queries.ts (Supabase reads), notify.ts (Formspree email on report),
                supabase/{client,server,proxy-session}.ts
proxy.ts        Supabase session refresh (Next 16's renamed middleware)
supabase/       migrations/ (schema + RLS + triggers + storage bucket; apply all in order), SETUP.md
```

## Content-editing recipes
- **Add a group:** append a `Group` to `data/groups.ts`. `joinUrl: null` renders a "Join via the main hub" button; the detail page and QR code fall back to the main hub. Detail page + sitemap update automatically.
- **Add an announcement:** prepend an `Announcement` (ISO `date`) to `data/announcements.ts` (newest first).
- **Events & Newcomer's Guide are now DB-backed** (Supabase, admin-managed in-site — not `data/*.ts`). Sign in as an admin and use the add/edit/delete controls on `/events` and `/newcomers`. Both pages are server-rendered with ISR (still SEO-indexable). `data/events.ts` / `data/newcomers.ts` remain only as the migration seed/reference. `/events` also has "Happening today" + upcoming/past and emits Event JSON-LD.
- **Add an FAQ:** append a `Faq` to `data/faqs.ts` — also feeds the FAQPage JSON-LD.
- **Business listing:** add a `Business` to `data/businesses.ts` (admin-curated; requests arrive via the contact form).
- **Global settings** (site URL, main hub link, Formspree ID): `data/site.ts`.
- **Weather / currency:** no data file — they're code-only client islands fetching live APIs. Tune the currency source in `lib/rates.ts`, board constants (categories, expiry) in `lib/community.ts`.
- **Community board content is user-generated in Supabase**, *not* `data/*.ts`. Moderators and admins review reported posts/answers at `/admin` (see Admin Dashboard below). Bulk actions: dismiss reports, close posts (set `status='closed'`), or delete content. Admins can toggle email notifications (one per-user toggle gates a shared Formspree inbox) and promote/demote other users by email at `/admin/team`. Set `profiles.is_admin = true` for full admins or `profiles.can_moderate_reports = true` for moderators-only (see `supabase/SETUP.md` bootstrap).
- **Admin dashboard** (`/admin`): moderators see open reports grouped by target (post/answer), with reason(s) and live count per target. Checkboxes select targets; three bulk-action buttons (Dismiss Reports, Close Posts, Delete Content). Checking "Email me on new report" toggles `notify_on_report`; if any mod/admin has it on, Formspree gets a notification in the shared contact inbox when a report files.
- **Team management** (`/admin/team`, admin-only): promote users by email (they must have signed in once). Per-user checkboxes: Full Admin (all privileges), Moderator (reports + close/delete reported content only). Prevent self-edit to avoid accidental lockout.

## Conventions & guardrails
- Server Components by default; add `"use client"` only when you truly need browser APIs.
- **WhatsApp green (`bg-wa`) is reserved for Join CTAs only** (see `JoinButton`). Use gradient accents (saffron→violet) elsewhere — including the community board.
- **Brand source of truth:** color tokens + the display font (**Space Grotesk**, body is Inter) live in `public/desi-gr-hub-logo/brand.css` and are mirrored into `app/globals.css` `@theme`. The logo mark is `components/LogoMark.tsx` (also the `app/icon.svg` favicon and `app/opengraph-image.tsx`). Keep these in sync — don't hardcode off-brand hex or swap the heading font.
- Keep the bundle small — no heavy libraries, no animation libraries. The board added exactly two deps (`@supabase/supabase-js`, `@supabase/ssr`); there is **no ORM** — `supabase-js` + RLS is the data layer.
- Maintain **44px+ tap targets** (`min-h-11`) and mobile-first layouts; test at 375px.
- Preserve per-page SEO metadata and JSON-LD when editing pages. Board SEO: **questions are indexable** (QAPage JSON-LD, in the sitemap); **housing/marketplace listings are `noindex`** (they expire).
- **Community board security:** RLS policies (`supabase/migrations/`) are the real enforcement, but **every server action re-checks auth** — actions are reachable via direct POST. Keep both.
- **Never remove the disclaimers** — the static ones (`data/safety.ts`, footer, group pages) *and* `communityDisclaimer`, which must show on every listing and the post-creation form.

## Commands
- `npm run dev` — local dev
- `npm run build` — must pass (types + static generation) before any PR
- `npm run lint`
- Community board needs env: copy `.env.example` → `.env.local` and fill the Supabase keys (`supabase/SETUP.md`). Without them the site still builds and all static pages work; the board just shows sign-in/empty states (fetches are env-guarded).

## Roadmap
The v2 community board (Q&A + housing + marketplace) is **built** — Supabase-backed, additive to the static site (see `supabase/SETUP.md` to provision it). v4 adds **admin moderation**: reports queue at `/admin`, email alerts, and team management at `/admin/team` to promote/demote moderators by email. The original guardrail still holds: keep the static marketing pages independent of the database. Future ideas: in-app notifications, saved searches, richer moderation tooling (report comments, etc.).
