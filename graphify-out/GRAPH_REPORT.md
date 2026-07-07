# Graph Report - .  (2026-07-07)

## Corpus Check
- 28 files · ~20,273 words
- Verdict: corpus is large enough that graph structure adds value.

## Summary
- 314 nodes · 508 edges · 20 communities (13 shown, 7 thin omitted)
- Extraction: 99% EXTRACTED · 1% INFERRED · 0% AMBIGUOUS · INFERRED: 6 edges (avg confidence: 0.78)
- Token cost: 42,984 input · 0 output

## Community Hubs (Navigation)
- [[_COMMUNITY_Marketing & Landing Pages|Marketing & Landing Pages]]
- [[_COMMUNITY_Community Board Actions|Community Board Actions]]
- [[_COMMUNITY_Group & Static Pages|Group & Static Pages]]
- [[_COMMUNITY_Architecture & Design Concepts|Architecture & Design Concepts]]
- [[_COMMUNITY_Dependencies|Dependencies]]
- [[_COMMUNITY_Layout, Header & AuthNav|Layout, Header & AuthNav]]
- [[_COMMUNITY_TypeScript Config|TypeScript Config]]
- [[_COMMUNITY_Currency Converter|Currency Converter]]
- [[_COMMUNITY_Proxy & Session Refresh|Proxy & Session Refresh]]
- [[_COMMUNITY_Auth Buttons & Browser Client|Auth Buttons & Browser Client]]
- [[_COMMUNITY_OpenGraph Image|OpenGraph Image]]
- [[_COMMUNITY_ESLint Config|ESLint Config]]
- [[_COMMUNITY_Next.js Config|Next.js Config]]
- [[_COMMUNITY_PostCSS Config|PostCSS Config]]
- [[_COMMUNITY_Mobile-First|Mobile-First]]
- [[_COMMUNITY_Site Verification|Site Verification]]

## God Nodes (most connected - your core abstractions)
1. `compilerOptions` - 16 edges
2. `PageHeader()` - 12 edges
3. `site` - 12 edges
4. `Community Board` - 11 edges
5. `Static Marketing Pages` - 8 edges
6. `JoinButton()` - 7 edges
7. `fetchRates()` - 7 edges
8. `requireUser()` - 7 edges
9. `timeAgo()` - 7 edges
10. `getCurrentUser` - 7 edges

## Surprising Connections (you probably didn't know these)
- `Business Directory` --conceptually_related_to--> `Static Marketing Pages`  [INFERRED]
  README.md → AGENTS.md
- `BusinessesPage()` --calls--> `getGroup()`  [EXTRACTED]
  app/businesses/page.tsx → data/groups.ts
- `generateMetadata()` --calls--> `getGroup()`  [EXTRACTED]
  app/groups/[slug]/page.tsx → data/groups.ts
- `GroupDetailPage()` --calls--> `getGroup()`  [EXTRACTED]
  app/groups/[slug]/page.tsx → data/groups.ts
- `AnswerList()` --calls--> `timeAgo()`  [EXTRACTED]
  components/community/AnswerList.tsx → lib/community.ts

## Import Cycles
- None detected.

## Hyperedges (group relationships)
- **Community Board Auth Flow** — agents_google_oauth, agents_email_magic_link, agents_proxy_ts, agents_auth_callback, agents_row_level_security, agents_authnav [INFERRED 0.85]
- **Live Client Islands (static HTML, hydrated data)** — agents_weather_banner, agents_currency_converter, agents_authnav, agents_client_islands [INFERRED 0.75]
- **Community Board Data Layer** — agents_supabase, agents_row_level_security, agents_server_actions, development_database_migrations [INFERRED 0.85]
- **Three Post Types on Unified Posts Table** — readme_qa_post_type, readme_housing_post_type, readme_marketplace_post_type, supabase_setup_posts_table [INFERRED 0.85]

## Communities (20 total, 7 thin omitted)

### Community 0 - "Marketing & Landing Pages"
Cohesion: 0.05
Nodes (32): fmt, metadata, metadata, ORDER, metadata, fmt, metadata, metadata (+24 more)

### Community 1 - "Community Board Actions"
Cohesion: 0.08
Nodes (42): AccountPage(), metadata, addAnswer(), castVote(), closePost(), createPost(), deletePost(), friendly() (+34 more)

### Community 2 - "Group & Static Pages"
Cohesion: 0.09
Nodes (22): BusinessesPage(), metadata, metadata, generateMetadata(), GroupDetailPage(), Params, steps, sitemap() (+14 more)

### Community 3 - "Architecture & Design Concepts"
Cohesion: 0.07
Nodes (38): Auth Callback (OAuth + magic-link code exchange), AuthNav (header auth island), WhatsApp Green (bg-wa) Join CTA, Live Client Islands, Community Board, Community Disclaimer, Content-as-Data (data/*.ts), Currency Converter / ForexIndicator (+30 more)

### Community 4 - "Dependencies"
Cohesion: 0.07
Nodes (27): dependencies, @formspree/react, next, react, react-dom, @supabase/ssr, @supabase/supabase-js, @vercel/analytics (+19 more)

### Community 5 - "Layout, Header & AuthNav"
Cohesion: 0.12
Nodes (17): signOut(), inter, metadata, spaceGrotesk, viewport, AuthNav(), firstName(), Footer() (+9 more)

### Community 6 - "TypeScript Config"
Cohesion: 0.10
Nodes (19): compilerOptions, allowJs, esModuleInterop, incremental, isolatedModules, jsx, lib, module (+11 more)

### Community 7 - "Currency Converter"
Cohesion: 0.22
Nodes (10): metadata, CurrencyConverter(), format(), label(), names, ForexIndicator(), FALLBACK(), fetchRates() (+2 more)

### Community 8 - "Proxy & Session Refresh"
Cohesion: 0.60
Nodes (3): updateSession(), config, proxy()

## Knowledge Gaps
- **98 isolated node(s):** `metadata`, `fmt`, `metadata`, `metadata`, `ORDER` (+93 more)
  These have ≤1 connection - possible missing edges or undocumented components.
- **7 thin communities (<3 nodes) omitted from report** — run `graphify query` to explore isolated nodes.

## Suggested Questions
_Questions this graph is uniquely positioned to answer:_

- **Why does `dependencies` connect `Dependencies` to `Group & Static Pages`?**
  _High betweenness centrality (0.114) - this node is a cross-community bridge._
- **Why does `qrcode` connect `Group & Static Pages` to `Dependencies`?**
  _High betweenness centrality (0.114) - this node is a cross-community bridge._
- **Why does `PageHeader()` connect `Marketing & Landing Pages` to `Group & Static Pages`, `Currency Converter`?**
  _High betweenness centrality (0.066) - this node is a cross-community bridge._
- **What connects `metadata`, `fmt`, `metadata` to the rest of the system?**
  _98 weakly-connected nodes found - possible documentation gaps or missing edges._
- **Should `Marketing & Landing Pages` be split into smaller, more focused modules?**
  _Cohesion score 0.05143191116306254 - nodes in this community are weakly interconnected._
- **Should `Community Board Actions` be split into smaller, more focused modules?**
  _Cohesion score 0.07683000604960677 - nodes in this community are weakly interconnected._
- **Should `Group & Static Pages` be split into smaller, more focused modules?**
  _Cohesion score 0.09302325581395349 - nodes in this community are weakly interconnected._