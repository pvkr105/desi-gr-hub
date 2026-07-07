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

**Non-negotiables:** **mobile-first** (~95% of visitors are on phones via WhatsApp forwards) and **SEO-strong** (the community grows through search + shares). The **marketing pages stay fully static and free to host**; the *only* dynamic part is the **community board**, backed by **Supabase (free tier)** with auth + Row-Level Security. Keep that split clean — a marketing page must never depend on the database.

## Architecture at a glance
- **Next.js 16 App Router + React 19 + TypeScript (strict) + Tailwind v4.**
- **Static marketing content** lives in typed files under `data/*.ts`, typed by `lib/types.ts`. **Editing that content never requires touching components.**
- Pages in `app/`, shared UI in `components/`. Server Components by default; `"use client"` only for genuine interactivity (mobile menu, `CopyLinkButton`, and the live islands below).
- Marketing pages are statically generated. QR codes render to SVG **at build time** in the `QrCode` server component (`qrcode` package). Contact form is a plain HTML POST to **Formspree** (no backend).
- **Two live client islands** fetch free, **keyless** public APIs in the browser — the HTML stays static, only the numbers hydrate: `WeatherBanner` (Open-Meteo) and the currency `ForexIndicator` / `CurrencyConverter` (fawazahmed0 rates, via `lib/rates.ts`).
- **Community board** (`/community/*`, `/account`) is the dynamic tier: **Supabase** Postgres + Auth (Google OAuth + email magic link). **Row-Level Security is the authorization layer**; mutations go through **server actions** (`app/community/actions.ts`); the session cookie is refreshed in **`proxy.ts`**. Schema + policies live in `supabase/migrations/`. Setup: `supabase/SETUP.md`.

```
app/            marketing pages + sitemap.ts, robots.ts, opengraph-image.tsx, not-found.tsx
  community/    board: landing, [type] list, [type]/[id] detail, new, actions.ts   ← DB-backed
  account/      sign-in / profile
  auth/callback/ OAuth + magic-link code exchange (route handler)
components/      Header, Footer, StickyJoinBar, JoinButton, GroupCard, BusinessCard, QrCode, LogoMark,
                CopyLinkButton, PageHeader, JsonLd, WeatherBanner, ForexIndicator, CurrencyConverter, AuthNav
  community/    PostCard, PostForm, VoteButtons, ReportButton, AnswerList, AnswerForm, AuthButtons
data/           groups, faqs, announcements, events, guidelines, safety, newcomers, businesses, site  ← edit these
lib/            types.ts (all interfaces), rates.ts (FX fetch), community.ts (board constants),
                queries.ts (Supabase reads), supabase/{client,server,proxy-session}.ts
proxy.ts        Supabase session refresh (Next 16's renamed middleware)
supabase/       migrations/ (schema + RLS + triggers; apply all in order), SETUP.md
```

## Content-editing recipes
- **Add a group:** append a `Group` to `data/groups.ts`. `joinUrl: null` renders a "Join via the main hub" button; the detail page and QR code fall back to the main hub. Detail page + sitemap update automatically.
- **Add an announcement:** prepend an `Announcement` (ISO `date`) to `data/announcements.ts` (newest first).
- **Add an event:** prepend an `Event` (ISO `date`) to `data/events.ts`; the page splits upcoming/past and emits Event JSON-LD automatically.
- **Add an FAQ:** append a `Faq` to `data/faqs.ts` — also feeds the FAQPage JSON-LD.
- **Newcomer's Guide:** edit sections/entries in `data/newcomers.ts` (currently placeholder content marked for admin review).
- **Business listing:** add a `Business` to `data/businesses.ts` (admin-curated; requests arrive via the contact form).
- **Global settings** (site URL, main hub link, Formspree ID): `data/site.ts`.
- **Weather / currency:** no data file — they're code-only client islands fetching live APIs. Tune the currency source in `lib/rates.ts`, board constants (categories, expiry) in `lib/community.ts`.
- **Community board content is user-generated in Supabase**, *not* `data/*.ts`. Admins moderate via the board UI (delete/close) or the DB; make a user an admin by setting `profiles.is_admin = true` (see `supabase/SETUP.md`).

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
The v2 community board (Q&A + housing + marketplace) is **built** — Supabase-backed, additive to the static site (see `supabase/SETUP.md` to provision it). The original guardrail still holds: keep the static marketing pages independent of the database. Future ideas: in-app notifications, saved searches, richer moderation tooling.
