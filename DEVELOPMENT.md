# Development & operations

How to run, update, and publish the site. For what the project is, see [README.md](./README.md).

## Updating content

All of the site's content lives in plain text files in `data/`. Edit the right file, save, and push to GitHub; the site rebuilds and updates automatically within a minute or two. You never edit components to change content.

| To change… | Edit this file |
|---|---|
| A WhatsApp group (name, description, invite link) | `data/groups.ts` |
| Announcements | `data/announcements.ts` (newest goes on top) |
| FAQ questions and answers | `data/faqs.ts` |
| Newcomer's Guide | `data/newcomers.ts` ⚠️ still has sample content to replace |
| Business directory listings | `data/businesses.ts` ⚠️ still has sample content to replace |
| Guidelines / safety text | `data/guidelines.ts`, `data/safety.ts` |
| Site address, main hub link, contact-form ID | `data/site.ts` |

Each file has short comments explaining what to fill in. Content is typed by `lib/types.ts`, so a wrong shape shows up as an error at build time.

## Before you go live

1. **Turn on the contact form.** Create a free form at [formspree.io](https://formspree.io), copy its form ID, and paste it into `formspreeId` in `data/site.ts`. Until you do, messages won't reach you.
2. **Set your web address.** Update `url` in `data/site.ts` to your real address (this makes your links and Google/WhatsApp previews correct).
3. **Replace the samples.** Swap the placeholder Newcomer's Guide entries and sample business listings (marked ⚠️) for real ones.

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
- Fully static output. Contact form via `@formspree/react`. Build-time QR codes via `qrcode`.

### Commands
```bash
npm install
npm run dev        # http://localhost:3000
npm run build      # production build; must pass before deploying
npm run lint
```

### Architecture
- Content in typed `data/` files (typed by `lib/types.ts`); pages in `app/`, shared UI in `components/`.
- Server Components by default; `"use client"` only for the mobile menu, the copy-link button, and the contact form.
- Every page is statically generated. Group detail pages use `generateStaticParams`; QR codes render to SVG at build time.
- SEO: per-page metadata, JSON-LD (Organization + WebSite on home, FAQPage on `/faq`, BreadcrumbList on group pages), `sitemap.ts`, `robots.ts`, generated `opengraph-image`.
- **Next 16 gotchas:** route `params`/`searchParams` are Promises (`await` them); Tailwind's gradient utility is `bg-linear-to-*`.

See [AGENTS.md](./AGENTS.md) for the full architecture, conventions, and content recipes (also used by AI coding agents).
