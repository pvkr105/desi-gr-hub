<!-- BEGIN:nextjs-agent-rules -->
# This is NOT the Next.js you know

This version has breaking changes — APIs, conventions, and file structure may all differ from your training data. Read the relevant guide in `node_modules/next/dist/docs/` before writing any code. Heed deprecation notices.

Key gotchas already hit on this project:
- Route `params` and `searchParams` are **Promises** — you must `await` them.
- Tailwind is **v4**: configured in CSS via `@theme` in `app/globals.css`, not a `tailwind.config.js`. Gradient utility is `bg-linear-to-*` (not `bg-gradient-to-*`).
<!-- END:nextjs-agent-rules -->

# Desi GR Hub — project guide

## What this is
The public website for **Desi GR Hub**, a WhatsApp community for Indian & South Asian folks in Grand Rapids and West Michigan. The site is the community's front door: it explains the community, showcases each WhatsApp group with join links + QR codes, and hosts guidelines, safety, FAQ, a Newcomer's Guide, and a business directory.

**Non-negotiables:** fully **static** (no DB, no auth — free to host), **mobile-first** (~95% of visitors are on phones via WhatsApp forwards), and **SEO-strong** (the community grows through search + shares).

## Architecture at a glance
- **Next.js 16 App Router + React 19 + TypeScript (strict) + Tailwind v4.**
- All content lives in typed files under `data/*.ts`, typed by `lib/types.ts`. **Editing content never requires touching components.**
- Pages in `app/`, shared UI in `components/`. Server Components by default; `"use client"` only for genuine interactivity (the mobile menu in `Header.tsx`, the `CopyLinkButton`).
- Everything is statically generated. QR codes render to SVG **at build time** in the `QrCode` server component (`qrcode` package) — no client-side generation.
- Contact form is a plain HTML POST to **Formspree** (no backend).

```
app/            pages + route files (sitemap.ts, robots.ts, opengraph-image.tsx, not-found.tsx)
components/      Header, Footer, StickyJoinBar, JoinButton, GroupCard, BusinessCard, QrCode, CopyLinkButton, PageHeader, JsonLd
data/           groups, faqs, announcements, guidelines, safety, newcomers, businesses, site  ← edit these
lib/types.ts    interfaces for all content
```

## Content-editing recipes
- **Add a group:** append a `Group` to `data/groups.ts`. `joinUrl: null` renders a "Join via the main hub" button; the detail page and QR code fall back to the main hub. Detail page + sitemap update automatically.
- **Add an announcement:** prepend an `Announcement` (ISO `date`) to `data/announcements.ts` (newest first).
- **Add an FAQ:** append a `Faq` to `data/faqs.ts` — also feeds the FAQPage JSON-LD.
- **Newcomer's Guide:** edit sections/entries in `data/newcomers.ts` (currently placeholder content marked for admin review).
- **Business listing:** add a `Business` to `data/businesses.ts` (admin-curated; requests arrive via the contact form).
- **Global settings** (site URL, main hub link, Formspree ID): `data/site.ts`.

## Conventions & guardrails
- Server Components by default; add `"use client"` only when you truly need browser APIs.
- **WhatsApp green (`bg-wa`) is reserved for Join CTAs only** (see `JoinButton`). Use gradient accents (saffron→violet) elsewhere.
- Keep the bundle small — no heavy libraries, no animation libraries.
- Maintain **44px+ tap targets** (`min-h-11`) and mobile-first layouts; test at 375px.
- Preserve per-page SEO metadata and JSON-LD when editing pages; write copy with the target search phrases naturally in headings/body.
- **Never remove the disclaimers** (`data/safety.ts`, footer, group pages).

## Commands
- `npm run dev` — local dev
- `npm run build` — must pass (static generation + types) before any PR
- `npm run lint`

## Roadmap
A v2 community posting board (Reddit-style Q&A with categories) is planned. It will need a database, so keep the static architecture clean so that feature can slot in without restructuring.
