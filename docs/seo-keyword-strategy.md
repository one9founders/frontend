# One9Founders SEO Keyword Strategy

**Date:** 2026-09-14  
**Sources:** Google Trends (12 months, relative interest), Google Search Console export (Performance through ~2026-09-02), SERP competitor scan

## Executive verdict

You are not missing page 1–4 for `"AI tools directory"` / `"AI ecosystem navigator"` because the site is broken. Those phrases have **almost no search demand**, while category leaders (Futurepedia, Toolify, There’s An AI For That) already own brand + discovery SERPs.

Google Trends relative interest (same batch, last 12 months, worldwide):

| Keyword | Avg interest | Peak |
|---------|--------------|------|
| ai agents | **51.3** | 100 |
| best ai tools | **28.0** | 53 |
| chatgpt alternatives | 2.6 | 5 |
| ai tools directory | **0.7** | 2 |
| ai tools for startups | **0.4** | 1 |

Competitor brand interest (same batch):

| Brand | Avg interest |
|-------|--------------|
| toolify | 51.2 |
| futurepedia | 40.1 |
| there's an ai for that | 39.3 |
| **one9founders** | **0.0** |

India geo (relative to Gemini/Claude in the same batch): Gemini dominates; `"best ai tools"` / `"ai tools india"` / `"ai tools for startups"` flatten near zero next to product brands.

**Implication:** Do not build the content calendar around “AI ecosystem navigator.” Build it around **high-demand tasks, agents, best-of lists, comparisons, and India/INR founder intent** — then earn directory authority as a side effect.

## What Search Console shows today

~1.6k clicks / ~195k impressions in the export window. Almost all organic demand is **tool/agent brand long-tails** (`undressher`, `moemate`, `tinywow`, `nextify`, LLM pricing queries), not category phrases.

| Theme in GSC queries | Queries | Reality |
|----------------------|---------|---------|
| directory / ecosystem / navigator | **0** | Not ranking; also low demand |
| best/top AI tools | **0** | Not ranking for head terms |
| ai tools for startups/founders | **0** | Not ranking |
| brand `one9founders` | tiny | Only people who already know you |
| agent/LLM tool names | majority of traffic | Working acquisition channel |

Homepage sits ~position 17 (~39 clicks). `/llms` gets impressions at ~position 43 with near-zero CTR — authority gap, not a missing H1.

Coverage (2026-09-20 GSC refresh): ~43k **Not indexed** vs ~29k indexed. Critical buckets:
~3.1k blocked by robots (query params + private paths — **intentional**),
~35.9k Discovered–not indexed, ~1.9k Crawled–not indexed, plus soft 404 / 404 /
noindex / redirects. Also **INP &gt; 200ms on mobile** across ~2.3k URLs (third-party
scripts in the shared shell). Indexing capacity is a bottleneck alongside keywords —
prefer sitemap ≈ indexable pages only, hard 404s instead of soft 404s, SSR metadata,
and deferred analytics so interactions stay under the INP budget.

## Strategy pillars (priority order)

### 1. Double down on programmatic SEO you already win

Individual `/tool/*`, `/agents/*`, `/llms/*` pages are the real traffic engine.

- Improve titles/meta/CTR for pages with **high impressions + CTR &lt; 1%** (e.g. moemate, tinywow, pexo, exporttok).
- Unique intros: who it’s for, INR pricing if known, security status, alternatives.
- Internal links from new blog posts → specific tool/agent pages (not only homepage).

### 2. Chase demand keywords, not vanity positioning

| Priority | Target keywords | Content type | Primary URL |
|----------|-----------------|--------------|-------------|
| P0 | ai agents, best ai agents, AI agent for startups | Hub + blog | `/agents`, new posts |
| P0 | best ai tools (2026), best AI tools for startups | Listicle + hub | `/`, `/blog/*`, `/tools/*` |
| P0 | Claude vs ChatGPT vs Gemini, LLM pricing India | Comparison | `/llms/compare`, blog |
| P1 | chatgpt alternatives, best LLM for coding | Comparison | blog + LLM pages |
| P1 | AI writing / image / coding tools for startups | Category hubs | `/tools/{category}` |
| P2 | ai tools directory, AI ecosystem map | Secondary only | about + homepage (already redirected long-tails) |
| P2 | one9founders brand | PR, Product Hunt, directories, LinkedIn | everywhere |

### 3. India wedge (defensible niche)

Competitors are global directories. Own:

- INR pricing / India-affordable LLMs
- DPDP / RBI / fintech stack (`/fintech`)
- Bootstrapped / solo founder India stacks
- Gemini/Claude pricing in India (GSC already shows impression crumbs)

### 4. Off-page: get listed where evaluators look

People searching directories often land on **roundups** (“best AI tool directories 2026”). Get One9Founders into those lists (TAAFT/Futurepedia-style coverage). That is faster for “directory” visibility than ranking the head term yourself.

### 5. Technical SEO fixes (same sprint as content)

1. Reduce **Discovered – not indexed** (prioritize sitemap quality, consolidate thin pages, fix soft 404s).
2. Keep `www` canonical consistent (apex still appears in GSC).
3. Strengthen `/llms` and category hubs with FAQ schema + unique copy (titles already exist).
4. Avoid letting NSFW/low-trust agent pages become the brand SERP face without clear categorization.
5. Keep page `robots` aligned with `/tools/sitemap/` (`criteria_completed >= 6` / substantive / HN catalogue) — never sitemap a noindex URL.
6. Defer Contentsquare + load reCAPTCHA on demand to shrink mobile INP regressions sitewide.

## Content cadence (first 30 days)

Publish **2 long posts/week** that each:

1. Target one P0/P1 keyword cluster  
2. Link to ≥5 live directory pages  
3. Include a clear CTA to compare / filter on One9Founders  
4. State the differentiator: security-first, INR, zero affiliate bias, IIT Bombay mentoring

### First wave (shipped or queued in repo)

1. Best AI Agents for Startup Founders (2026) → `/agents`  
2. Best AI Tools for Indian Startups (INR + practical stack) → `/`, `/fintech`, `/stacks`  
3. Claude vs ChatGPT vs Gemini for Founders → `/llms/compare`  
4. How to use an AI tools directory without getting affiliate-scammed → trust/methodology  
5. Category deep-dives: writing, coding, image (map to `/tools/{category}`)

### Do not prioritize early

- More keyword redirects for “India’s largest AI ecosystem navigator”
- Thin “what is an AI directory” posts with no internal links
- Competing head-to-head with Futurepedia/Toolify on “AI tools directory” alone

## Measurement

Track monthly in GSC:

- Impressions for: `best ai tools`, `ai agents`, `chatgpt alternatives`, `llm`, category + India queries  
- Blog landing clicks + assisted tool-page clicks  
- Brand queries for `one9founders`  
- Indexed page count (Coverage) trending down on “discovered not indexed”

Success in 60–90 days is **not** ranking #1 for “AI tools directory.” Success is ranking for **best AI agents / best AI tools for startups / LLM comparisons / India pricing**, with rising non-brand clicks into the directory.

## Trend → blog automation

Daily drafts (human approve before go-live):

```bash
npm run content:trends
# optional: TREND_GEOS=IN,US,GB TREND_LIMIT=5 npm run content:trends
```

Writes MDX templates to `content/blog/drafts/` from Google Daily Trends RSS. Editors rewrite the checklist into real analysis, deep-link directory pages, then promote into `src/lib/blog.ts` (or the sheet → `npm run content:generate` path). Auto-publishing unedited trend spam will hurt rankings — approval is intentional.

## Traffic goal (plain language)

**Average interest** on Google Trends is the mean of the daily 0–100 relative score for a keyword over the selected window (e.g. 12 months), *within the compared set*. It is not search volume and not “how many people searched.” A keyword at avg 0.7 next to one at 51 is tiny demand by comparison.

Goal = grow total site traffic. Path that works:

1. Rank page 1 for **many long-tail tool/agent/LLM queries** (already starting) + improve CTR.  
2. Publish trend-tied blog posts that route to directory pages.  
3. Keep core phrases (`AI tools directory`, `AI ecosystem navigator`) on homepage / `llms.txt` / about for AI crawlers and eventual authority — but do not wait on those head terms alone for traffic.  
4. Nobody ranks #1 for “anything trending related to AI” overnight; treat it as a system (trends → drafts → approve → index → internal links), not a single keyword win.

