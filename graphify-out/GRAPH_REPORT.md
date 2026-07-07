# Graph Report - .  (2026-07-07)

## Corpus Check
- Corpus is ~18,471 words - fits in a single context window. You may not need a graph.

## Summary
- 301 nodes · 550 edges · 16 communities (11 shown, 5 thin omitted)
- Extraction: 99% EXTRACTED · 1% INFERRED · 0% AMBIGUOUS · INFERRED: 6 edges (avg confidence: 0.83)
- Token cost: 44,433 input · 0 output

## Community Hubs (Navigation)
- [[_COMMUNITY_Marketing Pages|Marketing Pages]]
- [[_COMMUNITY_Group Pages & Layout|Group Pages & Layout]]
- [[_COMMUNITY_Community Board Actions|Community Board Actions]]
- [[_COMMUNITY_Architecture & Design Concepts|Architecture & Design Concepts]]
- [[_COMMUNITY_Dependencies & QR Code|Dependencies & QR Code]]
- [[_COMMUNITY_Auth & Community Data|Auth & Community Data]]
- [[_COMMUNITY_TypeScript Config|TypeScript Config]]
- [[_COMMUNITY_Currency Converter|Currency Converter]]
- [[_COMMUNITY_Weather Banner|Weather Banner]]
- [[_COMMUNITY_Proxy & Session Refresh|Proxy & Session Refresh]]
- [[_COMMUNITY_Live Client Islands|Live Client Islands]]
- [[_COMMUNITY_OpenGraph Image|OpenGraph Image]]
- [[_COMMUNITY_ESLint Config|ESLint Config]]
- [[_COMMUNITY_Next.js Config|Next.js Config]]
- [[_COMMUNITY_PostCSS Config|PostCSS Config]]
- [[_COMMUNITY_Formspree Contact Form|Formspree Contact Form]]

## God Nodes (most connected - your core abstractions)
1. `compilerOptions` - 16 edges
2. `PageHeader()` - 15 edges
3. `site` - 15 edges
4. `createClient()` - 13 edges
5. `Supabase` - 10 edges
6. `requireUser()` - 8 edges
7. `JoinButton()` - 8 edges
8. `getCurrentUser()` - 8 edges
9. `Community Board` - 8 edges
10. `timeAgo()` - 7 edges

## Surprising Connections (you probably didn't know these)
- `Business Directory` --conceptually_related_to--> `Static Marketing Pages`  [INFERRED]
  README.md → AGENTS.md
- `AccountPage()` --calls--> `getCurrentUser()`  [EXTRACTED]
  app/account/page.tsx → lib/queries.ts
- `GET()` --calls--> `createClient()`  [EXTRACTED]
  app/auth/callback/route.ts → lib/supabase/server.ts
- `BusinessesPage()` --calls--> `getGroup()`  [EXTRACTED]
  app/businesses/page.tsx → data/groups.ts
- `generateMetadata()` --calls--> `getPost()`  [EXTRACTED]
  app/community/[type]/[id]/page.tsx → lib/queries.ts

## Import Cycles
- None detected.

## Hyperedges (group relationships)
- **Community Board Auth Flow** — agents_google_oauth, agents_email_magic_link, agents_proxy_ts, agents_auth_callback, agents_row_level_security [EXTRACTED 1.00]
- **Three Post Types on Unified Posts Table** — readme_qa_post_type, readme_housing_post_type, readme_marketplace_post_type, supabase_setup_posts_table [INFERRED 0.85]
- **Keyless Live Client Islands** — agents_weather_banner, agents_currency_converter, agents_live_client_islands [EXTRACTED 1.00]

## Communities (16 total, 5 thin omitted)

### Community 0 - "Marketing Pages"
Cohesion: 0.05
Nodes (29): fmt, metadata, metadata, metadata, fmt, metadata, metadata, metadata (+21 more)

### Community 1 - "Group Pages & Layout"
Cohesion: 0.08
Nodes (27): BusinessesPage(), metadata, metadata, generateMetadata(), GroupDetailPage(), Params, inter, metadata (+19 more)

### Community 2 - "Community Board Actions"
Cohesion: 0.09
Nodes (33): addAnswer(), castVote(), closePost(), createPost(), deletePost(), reportContent(), requireUser(), metadata (+25 more)

### Community 3 - "Architecture & Design Concepts"
Cohesion: 0.07
Nodes (36): Auth Callback Route Handler, bg-wa Join CTA Convention, Community Board, Community Disclaimer, Content-as-Data, Desi GR Hub, Email Magic Link, Events Page (+28 more)

### Community 4 - "Dependencies & QR Code"
Cohesion: 0.07
Nodes (27): QrCode(), dependencies, @formspree/react, next, qrcode, react, react-dom, @supabase/ssr (+19 more)

### Community 5 - "Auth & Community Data"
Cohesion: 0.14
Nodes (18): AccountPage(), metadata, GET(), signOut(), NewPostPage(), QuestionThread(), CommunityTypePage(), sitemap() (+10 more)

### Community 6 - "TypeScript Config"
Cohesion: 0.10
Nodes (19): compilerOptions, allowJs, esModuleInterop, incremental, isolatedModules, jsx, lib, module (+11 more)

### Community 7 - "Currency Converter"
Cohesion: 0.29
Nodes (9): CurrencyConverter(), format(), label(), names, ForexIndicator(), FALLBACK(), fetchRates(), PRIMARY() (+1 more)

### Community 8 - "Weather Banner"
Cohesion: 0.47
Nodes (5): describe(), GR, isSnow(), Weather, WeatherBanner()

### Community 9 - "Proxy & Session Refresh"
Cohesion: 0.60
Nodes (3): updateSession(), config, proxy()

### Community 10 - "Live Client Islands"
Cohesion: 1.00
Nodes (3): Currency Converter, Live Client Islands, Weather Banner (Open-Meteo)

## Knowledge Gaps
- **90 isolated node(s):** `metadata`, `metadata`, `fmt`, `metadata`, `metadata` (+85 more)
  These have ≤1 connection - possible missing edges or undocumented components.
- **5 thin communities (<3 nodes) omitted from report** — run `graphify query` to explore isolated nodes.

## Suggested Questions
_Questions this graph is uniquely positioned to answer:_

- **Why does `PageHeader()` connect `Marketing Pages` to `Group Pages & Layout`, `Community Board Actions`, `Auth & Community Data`?**
  _High betweenness centrality (0.070) - this node is a cross-community bridge._
- **What connects `metadata`, `metadata`, `fmt` to the rest of the system?**
  _94 weakly-connected nodes found - possible documentation gaps or missing edges._
- **Should `Marketing Pages` be split into smaller, more focused modules?**
  _Cohesion score 0.05387205387205387 - nodes in this community are weakly interconnected._
- **Should `Group Pages & Layout` be split into smaller, more focused modules?**
  _Cohesion score 0.08244897959183674 - nodes in this community are weakly interconnected._
- **Should `Community Board Actions` be split into smaller, more focused modules?**
  _Cohesion score 0.0946938775510204 - nodes in this community are weakly interconnected._
- **Should `Architecture & Design Concepts` be split into smaller, more focused modules?**
  _Cohesion score 0.07142857142857142 - nodes in this community are weakly interconnected._
- **Should `Dependencies & QR Code` be split into smaller, more focused modules?**
  _Cohesion score 0.07142857142857142 - nodes in this community are weakly interconnected._