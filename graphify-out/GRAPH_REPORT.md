# Graph Report - .  (2026-07-07)

## Corpus Check
- 4 files · ~24,665 words
- Verdict: corpus is large enough that graph structure adds value.

## Summary
- 381 nodes · 595 edges · 29 communities (20 shown, 9 thin omitted)
- Extraction: 99% EXTRACTED · 1% INFERRED · 0% AMBIGUOUS · INFERRED: 8 edges (avg confidence: 0.78)
- Token cost: 38,000 input · 1,500 output

## Community Hubs (Navigation)
- [[_COMMUNITY_Static Info Pages|Static Info Pages]]
- [[_COMMUNITY_Groups & Businesses|Groups & Businesses]]
- [[_COMMUNITY_Board Actions|Board Actions]]
- [[_COMMUNITY_Post Pages|Post Pages]]
- [[_COMMUNITY_QR & Dependencies|QR & Dependencies]]
- [[_COMMUNITY_V3 Concepts|V3 Concepts]]
- [[_COMMUNITY_Admin CRUD|Admin CRUD]]
- [[_COMMUNITY_TypeScript|TypeScript]]
- [[_COMMUNITY_CommunityCurrency|Community/Currency]]
- [[_COMMUNITY_Layout & Footer|Layout & Footer]]
- [[_COMMUNITY_Currency Converter|Currency Converter]]
- [[_COMMUNITY_Proxy Session|Proxy Session]]
- [[_COMMUNITY_Auth Client|Auth Client]]
- [[_COMMUNITY_Goodbye|Goodbye]]
- [[_COMMUNITY_OpenGraph|OpenGraph]]
- [[_COMMUNITY_Home|Home]]
- [[_COMMUNITY_README Features|README Features]]
- [[_COMMUNITY_Sign-in Flow|Sign-in Flow]]
- [[_COMMUNITY_Community 23|Community 23]]
- [[_COMMUNITY_Community 26|Community 26]]
- [[_COMMUNITY_Community 27|Community 27]]
- [[_COMMUNITY_Community 28|Community 28]]

## God Nodes (most connected - your core abstractions)
1. `Desi GR Hub Site` - 22 edges
2. `compilerOptions` - 16 edges
3. `getCurrentUser` - 11 edges
4. `site` - 10 edges
5. `requireAdmin()` - 10 edges
6. `requireUser()` - 8 edges
7. `PageHeader()` - 7 edges
8. `fetchRates()` - 7 edges
9. `editPost()` - 7 edges
10. `Community Board` - 7 edges

## Surprising Connections (you probably didn't know these)
- `BusinessesPage()` --calls--> `getGroup()`  [EXTRACTED]
  app/businesses/page.tsx → data/groups.ts
- `generateMetadata()` --calls--> `getGroup()`  [EXTRACTED]
  app/groups/[slug]/page.tsx → data/groups.ts
- `GroupDetailPage()` --calls--> `getGroup()`  [EXTRACTED]
  app/groups/[slug]/page.tsx → data/groups.ts
- `ForexIndicator()` --calls--> `fetchRates()`  [EXTRACTED]
  components/ForexIndicator.tsx → lib/rates.ts
- `AnswerList()` --calls--> `timeAgo()`  [EXTRACTED]
  components/community/AnswerList.tsx → lib/community.ts

## Import Cycles
- None detected.

## Hyperedges (group relationships)
- **Admin CRUD for Events & Newcomer's Guide** — agents_admin_actions, agents_is_admin, agents_events, agents_newcomers_guide, agents_isr [EXTRACTED 0.90]
- **Post Image Upload Pipeline** — agents_image_uploads, agents_image_compression, supabase_setup_post_images_bucket, supabase_setup_migration_0003 [EXTRACTED 0.90]
- **Community Board Authorization (RLS + re-checked server actions)** — agents_community_board, agents_row_level_security, agents_server_actions, agents_community_actions [EXTRACTED 0.90]

## Communities (29 total, 9 thin omitted)

### Community 0 - "Static Info Pages"
Cohesion: 0.09
Nodes (22): BusinessesPage(), metadata, metadata, generateMetadata(), GroupDetailPage(), Params, sitemap(), BusinessCard() (+14 more)

### Community 1 - "Groups & Businesses"
Cohesion: 0.07
Nodes (23): fmt, metadata, metadata, metadata, metadata, JsonLd(), PageHeader(), announcements (+15 more)

### Community 2 - "Board Actions"
Cohesion: 0.08
Nodes (25): metadata, ORDER, CommunityTypePage(), metadata, AnswerList(), Props, PostCard(), Props (+17 more)

### Community 3 - "Post Pages"
Cohesion: 0.11
Nodes (21): AccountPage(), metadata, metadata, NewPostPage(), ORDER, EditPostPage(), metadata, EventsPage() (+13 more)

### Community 4 - "QR & Dependencies"
Cohesion: 0.07
Nodes (31): Google & Email Sign-In, Community Business Directory, Community Board, Contact Form, Content as Data Pattern, Currency Converter, Desi GR Hub Site, Events & Meetups (+23 more)

### Community 5 - "V3 Concepts"
Cohesion: 0.07
Nodes (27): dependencies, @formspree/react, next, react, react-dom, @supabase/ssr, @supabase/supabase-js, @vercel/analytics (+19 more)

### Community 6 - "Admin CRUD"
Cohesion: 0.10
Nodes (27): 24h Post Edit Window (canEdit), app/admin-actions.ts (admin CRUD), Supabase Auth (Google OAuth + magic link), Live Client Islands (Weather + Forex), app/community/actions.ts, Community Board, communityDisclaimer, Disclaimer Modal (gates posting) (+19 more)

### Community 7 - "TypeScript"
Cohesion: 0.17
Nodes (18): addAnswer(), castVote(), closePost(), createPost(), deletePost(), editPost(), friendly(), missingField() (+10 more)

### Community 8 - "Community/Currency"
Cohesion: 0.20
Nodes (16): createEntry(), createEvent(), createSection(), deleteEntry(), deleteEvent(), deleteSection(), eventFields(), num() (+8 more)

### Community 9 - "Layout & Footer"
Cohesion: 0.10
Nodes (19): compilerOptions, allowJs, esModuleInterop, incremental, isolatedModules, jsx, lib, module (+11 more)

### Community 10 - "Currency Converter"
Cohesion: 0.14
Nodes (13): inter, metadata, spaceGrotesk, viewport, Footer(), pageLinks, Header(), navLinks (+5 more)

### Community 11 - "Proxy Session"
Cohesion: 0.29
Nodes (9): CurrencyConverter(), format(), label(), names, ForexIndicator(), FALLBACK(), fetchRates(), PRIMARY() (+1 more)

### Community 12 - "Auth Client"
Cohesion: 0.60
Nodes (3): updateSession(), config, proxy()

## Knowledge Gaps
- **122 isolated node(s):** `metadata`, `fmt`, `metadata`, `metadata`, `Params` (+117 more)
  These have ≤1 connection - possible missing edges or undocumented components.
- **9 thin communities (<3 nodes) omitted from report** — run `graphify query` to explore isolated nodes.

## Suggested Questions
_Questions this graph is uniquely positioned to answer:_

- **Why does `dependencies` connect `V3 Concepts` to `Static Info Pages`?**
  _High betweenness centrality (0.077) - this node is a cross-community bridge._
- **Why does `qrcode` connect `Static Info Pages` to `V3 Concepts`?**
  _High betweenness centrality (0.077) - this node is a cross-community bridge._
- **What connects `metadata`, `fmt`, `metadata` to the rest of the system?**
  _124 weakly-connected nodes found - possible documentation gaps or missing edges._
- **Should `Static Info Pages` be split into smaller, more focused modules?**
  _Cohesion score 0.08668076109936575 - nodes in this community are weakly interconnected._
- **Should `Groups & Businesses` be split into smaller, more focused modules?**
  _Cohesion score 0.07051282051282051 - nodes in this community are weakly interconnected._
- **Should `Board Actions` be split into smaller, more focused modules?**
  _Cohesion score 0.08232118758434548 - nodes in this community are weakly interconnected._
- **Should `Post Pages` be split into smaller, more focused modules?**
  _Cohesion score 0.10967741935483871 - nodes in this community are weakly interconnected._