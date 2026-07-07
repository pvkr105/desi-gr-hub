# Graph Report - .  (2026-07-07)

## Corpus Check
- 29 files · ~24,476 words
- Verdict: corpus is large enough that graph structure adds value.

## Summary
- 355 nodes · 604 edges · 29 communities (17 shown, 12 thin omitted)
- Extraction: 99% EXTRACTED · 1% INFERRED · 0% AMBIGUOUS · INFERRED: 8 edges (avg confidence: 0.78)
- Token cost: 42,018 input · 2,000 output

## Community Hubs (Navigation)
- [[_COMMUNITY_Static Info Pages (FAQSafetyGuidelines)|Static Info Pages (FAQ/Safety/Guidelines)]]
- [[_COMMUNITY_Groups & Businesses Pages|Groups & Businesses Pages]]
- [[_COMMUNITY_Community Board Server Actions|Community Board Server Actions]]
- [[_COMMUNITY_Post Pages (NewEditDetail)|Post Pages (New/Edit/Detail)]]
- [[_COMMUNITY_QR Codes & Dependencies|QR Codes & Dependencies]]
- [[_COMMUNITY_V3 Board Concepts (EditingImagesAdmin)|V3 Board Concepts (Editing/Images/Admin)]]
- [[_COMMUNITY_Admin CRUD Actions (EventsNewcomers)|Admin CRUD Actions (Events/Newcomers)]]
- [[_COMMUNITY_TypeScript Config|TypeScript Config]]
- [[_COMMUNITY_CommunityCurrency Pages & Banners|Community/Currency Pages & Banners]]
- [[_COMMUNITY_Layout, Header & Footer|Layout, Header & Footer]]
- [[_COMMUNITY_Currency Converter & FX Rates|Currency Converter & FX Rates]]
- [[_COMMUNITY_Proxy Session Refresh|Proxy Session Refresh]]
- [[_COMMUNITY_Supabase Auth Client|Supabase Auth Client]]
- [[_COMMUNITY_Contact Page|Contact Page]]
- [[_COMMUNITY_Goodbye Page|Goodbye Page]]
- [[_COMMUNITY_OpenGraph Image|OpenGraph Image]]
- [[_COMMUNITY_Home Page|Home Page]]
- [[_COMMUNITY_Community 21|Community 21]]
- [[_COMMUNITY_Community 23|Community 23]]
- [[_COMMUNITY_Community 24|Community 24]]
- [[_COMMUNITY_Community 25|Community 25]]
- [[_COMMUNITY_Community 26|Community 26]]
- [[_COMMUNITY_Community 27|Community 27]]
- [[_COMMUNITY_Community 28|Community 28]]

## God Nodes (most connected - your core abstractions)
1. `compilerOptions` - 16 edges
2. `getCurrentUser` - 13 edges
3. `site` - 10 edges
4. `requireAdmin()` - 10 edges
5. `requireUser()` - 8 edges
6. `editPost()` - 8 edges
7. `Community Board` - 8 edges
8. `PageHeader()` - 7 edges
9. `fetchRates()` - 7 edges
10. `createPost()` - 7 edges

## Surprising Connections (you probably didn't know these)
- `AnswerList()` --calls--> `timeAgo()`  [EXTRACTED]
  components/community/AnswerList.tsx → lib/community.ts
- `BusinessesPage()` --calls--> `getGroup()`  [EXTRACTED]
  app/businesses/page.tsx → data/groups.ts
- `generateMetadata()` --calls--> `getGroup()`  [EXTRACTED]
  app/groups/[slug]/page.tsx → data/groups.ts
- `GroupDetailPage()` --calls--> `getGroup()`  [EXTRACTED]
  app/groups/[slug]/page.tsx → data/groups.ts
- `ForexIndicator()` --calls--> `fetchRates()`  [EXTRACTED]
  components/ForexIndicator.tsx → lib/rates.ts

## Import Cycles
- None detected.

## Hyperedges (group relationships)
- **Admin CRUD for Events & Newcomer's Guide** — agents_admin_actions, agents_is_admin, agents_events, agents_newcomers_guide, agents_isr [EXTRACTED 0.90]
- **Post Image Upload Pipeline** — agents_image_uploads, agents_image_compression, supabase_setup_post_images_bucket, supabase_setup_migration_0003 [EXTRACTED 0.90]
- **Community Board Authorization (RLS + re-checked server actions)** — agents_community_board, agents_row_level_security, agents_server_actions, agents_community_actions [EXTRACTED 0.90]
- **Three Post Types on Unified Posts Table** — readme_qa_post_type, readme_housing_post_type, readme_marketplace_post_type, supabase_setup_posts_table [INFERRED 0.85]

## Communities (29 total, 12 thin omitted)

### Community 0 - "Static Info Pages (FAQ/Safety/Guidelines)"
Cohesion: 0.07
Nodes (25): fmt, metadata, metadata, metadata, metadata, JsonLd(), PageHeader(), announcements (+17 more)

### Community 1 - "Groups & Businesses Pages"
Cohesion: 0.09
Nodes (20): BusinessesPage(), metadata, metadata, generateMetadata(), GroupDetailPage(), Params, sitemap(), BusinessCard() (+12 more)

### Community 2 - "Community Board Server Actions"
Cohesion: 0.10
Nodes (29): addAnswer(), castVote(), closePost(), createPost(), deletePost(), editPost(), friendly(), missingField() (+21 more)

### Community 3 - "Post Pages (New/Edit/Detail)"
Cohesion: 0.14
Nodes (24): AccountPage(), metadata, metadata, NewPostPage(), ORDER, EditPostPage(), metadata, generateMetadata() (+16 more)

### Community 4 - "QR Codes & Dependencies"
Cohesion: 0.07
Nodes (29): QrCode(), dependencies, @formspree/react, next, qrcode, react, react-dom, @supabase/ssr (+21 more)

### Community 5 - "V3 Board Concepts (Editing/Images/Admin)"
Cohesion: 0.09
Nodes (30): 24h Post Edit Window (canEdit), app/admin-actions.ts (admin CRUD), Supabase Auth (Google OAuth + magic link), Live Client Islands (Weather + Forex), app/community/actions.ts, Community Board, communityDisclaimer, Disclaimer Modal (gates posting) (+22 more)

### Community 6 - "Admin CRUD Actions (Events/Newcomers)"
Cohesion: 0.14
Nodes (21): createEntry(), createEvent(), createSection(), deleteEntry(), deleteEvent(), deleteSection(), eventFields(), num() (+13 more)

### Community 7 - "TypeScript Config"
Cohesion: 0.10
Nodes (19): compilerOptions, allowJs, esModuleInterop, incremental, isolatedModules, jsx, lib, module (+11 more)

### Community 8 - "Community/Currency Pages & Banners"
Cohesion: 0.14
Nodes (10): metadata, ORDER, CommunityTypePage(), metadata, ContributeBanner(), SignedOutOnly(), CATEGORIES, TYPE_META (+2 more)

### Community 9 - "Layout, Header & Footer"
Cohesion: 0.14
Nodes (13): inter, metadata, spaceGrotesk, viewport, Footer(), pageLinks, Header(), navLinks (+5 more)

### Community 10 - "Currency Converter & FX Rates"
Cohesion: 0.29
Nodes (9): CurrencyConverter(), format(), label(), names, ForexIndicator(), FALLBACK(), fetchRates(), PRIMARY() (+1 more)

### Community 11 - "Proxy Session Refresh"
Cohesion: 0.60
Nodes (3): updateSession(), config, proxy()

## Knowledge Gaps
- **102 isolated node(s):** `metadata`, `fmt`, `metadata`, `metadata`, `Params` (+97 more)
  These have ≤1 connection - possible missing edges or undocumented components.
- **12 thin communities (<3 nodes) omitted from report** — run `graphify query` to explore isolated nodes.

## Suggested Questions
_Questions this graph is uniquely positioned to answer:_

- **Why does `QrCode()` connect `QR Codes & Dependencies` to `Groups & Businesses Pages`?**
  _High betweenness centrality (0.047) - this node is a cross-community bridge._
- **What connects `metadata`, `fmt`, `metadata` to the rest of the system?**
  _103 weakly-connected nodes found - possible documentation gaps or missing edges._
- **Should `Static Info Pages (FAQ/Safety/Guidelines)` be split into smaller, more focused modules?**
  _Cohesion score 0.06620209059233449 - nodes in this community are weakly interconnected._
- **Should `Groups & Businesses Pages` be split into smaller, more focused modules?**
  _Cohesion score 0.09390243902439024 - nodes in this community are weakly interconnected._
- **Should `Community Board Server Actions` be split into smaller, more focused modules?**
  _Cohesion score 0.09878048780487805 - nodes in this community are weakly interconnected._
- **Should `Post Pages (New/Edit/Detail)` be split into smaller, more focused modules?**
  _Cohesion score 0.13763440860215054 - nodes in this community are weakly interconnected._
- **Should `QR Codes & Dependencies` be split into smaller, more focused modules?**
  _Cohesion score 0.06666666666666667 - nodes in this community are weakly interconnected._