# Graph Report - .  (2026-07-05)

## Corpus Check
- Corpus is ~9,329 words - fits in a single context window. You may not need a graph.

## Summary
- 91 nodes · 49 edges · 51 communities (40 shown, 11 thin omitted)
- Extraction: 0% EXTRACTED · 0% INFERRED · 0% AMBIGUOUS
- Token cost: 0 input · 0 output

## Community Hubs (Navigation)
- [[_COMMUNITY_Community 0|Community 0]]
- [[_COMMUNITY_Community 1|Community 1]]
- [[_COMMUNITY_Community 2|Community 2]]
- [[_COMMUNITY_Community 3|Community 3]]
- [[_COMMUNITY_Community 4|Community 4]]
- [[_COMMUNITY_Community 5|Community 5]]
- [[_COMMUNITY_Community 21|Community 21]]
- [[_COMMUNITY_Community 22|Community 22]]
- [[_COMMUNITY_Community 42|Community 42]]
- [[_COMMUNITY_Community 44|Community 44]]
- [[_COMMUNITY_Community 45|Community 45]]
- [[_COMMUNITY_Community 46|Community 46]]
- [[_COMMUNITY_Community 47|Community 47]]
- [[_COMMUNITY_Community 48|Community 48]]
- [[_COMMUNITY_Community 49|Community 49]]
- [[_COMMUNITY_Community 50|Community 50]]

## God Nodes (most connected - your core abstractions)

## Surprising Connections (you probably didn't know these)
- `Desi GR Hub` ----> `Content as Data`  [1.0]
   →   _Bridges community 1 → community 0_
- `Desi GR Hub` ----> `Static Generation`  [1.0]
   →   _Bridges community 1 → community 4_
- `Desi GR Hub` ----> `Next.js 16`  [1.0]
   →   _Bridges community 1 → community 2_
- `Content as Data` ----> `data/groups.ts`  [1.0]
   →   _Bridges community 0 → community 3_
- `QR Code Generation` ----> `QrCode Component`  [1.0]
   →   _Bridges community 4 → community 2_

## Import Cycles
- None detected.

## Communities (51 total, 11 thin omitted)

### Community 0 - "Community 0"
Cohesion: 0.17
Nodes (12): Content as Data, data/announcements.ts, data/businesses.ts, data/faqs.ts, data/guidelines.ts, data/newcomers.ts, data/safety.ts, data/site.ts (+4 more)

### Community 1 - "Community 1"
Cohesion: 0.18
Nodes (12): CopyLinkButton Component, JoinButton Component, Vercel Deployment, Color Scheme, Mobile-first Design, WhatsApp Integration, Tailwind Gradient Utility, Desi GR Hub (+4 more)

### Community 2 - "Community 2"
Cohesion: 0.29
Nodes (7): App Router, generateStaticParams, Server Components, GroupCard Component, QrCode Component, Route params are Promises, Next.js 16

### Community 3 - "Community 3"
Cohesion: 0.29
Nodes (7): data/groups.ts, Bing Webmaster Tools, Google Search Console, SEO Optimization, Group Detail Page, robots.ts, sitemap.ts

### Community 4 - "Community 4"
Cohesion: 0.33
Nodes (6): Static Generation, No Authentication, No Database, QR Code Generation, npm run build, qrcode package

## Knowledge Gaps
- **11 thin communities (<3 nodes) omitted from report** — run `graphify query` to explore isolated nodes.

## Suggested Questions
_Not enough signal to generate questions. This usually means the corpus has no AMBIGUOUS edges, no bridge nodes, no INFERRED relationships, and all communities are tightly cohesive. Add more files or run with --mode deep to extract richer edges._