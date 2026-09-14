/**
 * Trend → blog draft automation (human-approved publish).
 *
 * Pulls Google Daily Trends RSS (IN + US by default), picks rising topics,
 * and writes draft MDX posts that relate each trend to AI + One9Founders
 * directory pages. Drafts land in content/blog/drafts/ — they are NOT live
 * until an editor promotes them into src/lib/blog.ts (or the sheet → content:generate path).
 *
 * Usage:
 *   npm run content:trends
 *   TREND_GEOS=IN,US,GB npm run content:trends
 *   TREND_LIMIT=5 npm run content:trends
 */
import { mkdir, readdir, writeFile } from 'node:fs/promises';
import { join } from 'node:path';

const DRAFT_DIR = join(process.cwd(), 'content', 'blog', 'drafts');
const DEFAULT_GEOS = (process.env.TREND_GEOS || 'IN,US')
  .split(',')
  .map((g) => g.trim().toUpperCase())
  .filter(Boolean);
const LIMIT = Math.max(1, Math.min(20, Number(process.env.TREND_LIMIT || 8)));

interface TrendItem {
  title: string;
  approxTraffic?: string;
  link?: string;
  geo: string;
  published?: string;
}

function slugify(title: string): string {
  return (
    title
      .toLowerCase()
      .normalize('NFKD')
      .replace(/[^\w\s-]/g, '')
      .trim()
      .replace(/[\s_]+/g, '-')
      .replace(/-+/g, '-')
      .replace(/^-|-$/g, '')
      .slice(0, 72) || 'trend'
  );
}

function yamlScalar(value: string): string {
  return JSON.stringify(value);
}

function todayIso(): string {
  const now = new Date();
  return new Date(Date.UTC(now.getUTCFullYear(), now.getUTCMonth(), now.getUTCDate()))
    .toISOString()
    .slice(0, 10);
}

function decodeXml(text: string): string {
  return text
    .replace(/<!\[CDATA\[([\s\S]*?)\]\]>/g, '$1')
    .replace(/&amp;/g, '&')
    .replace(/&lt;/g, '<')
    .replace(/&gt;/g, '>')
    .replace(/&quot;/g, '"')
    .replace(/&#39;/g, "'");
}

function parseTrendRss(xml: string, geo: string): TrendItem[] {
  const items: TrendItem[] = [];
  const blocks = xml.split(/<item>/i).slice(1);
  for (const block of blocks) {
    const title = decodeXml((block.match(/<title>([\s\S]*?)<\/title>/i)?.[1] || '').trim());
    if (!title) continue;
    const link = decodeXml((block.match(/<link>([\s\S]*?)<\/link>/i)?.[1] || '').trim()) || undefined;
    const published =
      decodeXml((block.match(/<pubDate>([\s\S]*?)<\/pubDate>/i)?.[1] || '').trim()) || undefined;
    const approxTraffic =
      decodeXml(
        (block.match(/<ht:approx_traffic>([\s\S]*?)<\/ht:approx_traffic>/i)?.[1] || '').trim()
      ) || undefined;
    items.push({ title, link, published, approxTraffic, geo });
  }
  return items;
}

async function fetchGeoTrends(geo: string): Promise<TrendItem[]> {
  const url = `https://trends.google.com/trending/rss?geo=${encodeURIComponent(geo)}`;
  const res = await fetch(url, {
    headers: {
      'User-Agent': 'one9founders-trend-pipeline/1.0 (hello@one9founders.com)',
      Accept: 'application/rss+xml, application/xml, text/xml, */*',
    },
  });
  if (!res.ok) {
    throw new Error(`Trends RSS ${geo} failed: ${res.status} ${res.statusText}`);
  }
  return parseTrendRss(await res.text(), geo);
}

function looksAlreadyAi(title: string): boolean {
  return /\b(ai|chatgpt|claude|gemini|llm|openai|anthropic|midjourney|copilot)\b/i.test(title);
}

/** Higher = better draft candidate for One9Founders. Pure sports/celeb noise scores low. */
function relevanceScore(title: string): number {
  const t = title.toLowerCase();
  let score = 0;
  if (looksAlreadyAi(t)) score += 50;
  if (/\b(tech|software|app|startup|founder|saas|cloud|cyber|data|robot|chip|semiconductor|iphone|android|ios|google|microsoft|meta|amazon|nvidia)\b/.test(t)) {
    score += 25;
  }
  if (/\b(business|market|economy|ipo|funding|fintech|bank|policy|regulation|privacy|security)\b/.test(t)) {
    score += 15;
  }
  if (/\b(science|climate|health|education|research)\b/.test(t)) score += 8;
  if (/\b(vs\.?|match|score|league|cup|fc|united|fc |ipl|cricket|football|soccer|nba|nfl|tennis|golf)\b/.test(t)) {
    score -= 40;
  }
  if (/\b(celebrity|bollywood|hollywood|actress|singer|wedding| Divorce)\b/.test(t)) score -= 30;
  // Very short / empty slug risk
  if (t.length < 3) score -= 20;
  return score;
}

function pickDirectoryHooks(title: string): { path: string; label: string }[] {
  const t = title.toLowerCase();
  const hooks: { path: string; label: string }[] = [
    { path: '/', label: 'AI tools directory' },
    { path: '/blog', label: 'founder blog' },
  ];
  if (/\b(agent|autonom|bot)\b/.test(t)) hooks.unshift({ path: '/agents', label: 'AI agents directory' });
  if (/\b(llm|gpt|claude|gemini|model|openai)\b/.test(t)) {
    hooks.unshift({ path: '/llms', label: 'LLM directory' });
    hooks.push({ path: '/llms/compare', label: 'LLM compare' });
  }
  if (/\b(code|coding|developer|github|software)\b/.test(t)) {
    hooks.push({ path: '/tools/coding', label: 'AI coding tools' });
  }
  if (/\b(market|growth|seo|content|writer|writing)\b/.test(t)) {
    hooks.push({ path: '/tools/writing', label: 'AI writing tools' });
  }
  if (/\b(india|inr|rupee|startup|founder)\b/.test(t)) {
    hooks.push({ path: '/stacks', label: 'founder stacks' });
    hooks.push({ path: '/fintech', label: 'India fintech AI stack' });
  }
  // de-dupe by path
  const seen = new Set<string>();
  return hooks.filter((h) => (seen.has(h.path) ? false : (seen.add(h.path), true))).slice(0, 5);
}

function renderDraft(item: TrendItem, date: string): string {
  const aiNative = looksAlreadyAi(item.title);
  const hooks = pickDirectoryHooks(item.title);
  const title = aiNative
    ? `${item.title}: What Startup Founders Should Know`
    : `${item.title} — What It Means for AI Tools & Founders`;
  const summary = aiNative
    ? `Trending now (${item.geo}${item.approxTraffic ? `, ~${item.approxTraffic} searches` : ''}): ${item.title}. Here is the founder take and where it maps on the One9Founders AI tools directory.`
    : `"${item.title}" is trending (${item.geo}${item.approxTraffic ? `, ~${item.approxTraffic} searches` : ''}). Here is how founders can use AI tools, agents, and LLMs to respond — with links into the One9Founders directory.`;

  const hookLines = hooks
    .map((h) => `- [${h.label}](https://www.one9founders.com${h.path})`)
    .join('\n');

  return [
    '---',
    `title: ${yamlScalar(title)}`,
    `date: ${yamlScalar(date)}`,
    `summary: ${yamlScalar(summary)}`,
    `status: ${yamlScalar('draft')}`,
    `trend_geo: ${yamlScalar(item.geo)}`,
    `trend_topic: ${yamlScalar(item.title)}`,
    item.approxTraffic ? `trend_traffic: ${yamlScalar(item.approxTraffic)}` : null,
    item.link ? `trend_source: ${yamlScalar(item.link)}` : null,
    'tags:',
    `  - ${yamlScalar('trending')}`,
    `  - ${yamlScalar('ai-for-founders')}`,
    `  - ${yamlScalar(item.geo.toLowerCase())}`,
    '---',
    '',
    '<!-- DRAFT: review before publishing to src/lib/blog.ts or approving in the content sheet -->',
    '',
    `## Why "${item.title}" is on our radar`,
    '',
    aiNative
      ? `${item.title} is moving in search. Founders should separate hype from a usable stack change — pricing, security posture, and whether it replaces a tool you already pay for.`
      : `Even when a trend is not "about AI," founders still ask: can AI tools help me research this faster, write about it, ship a feature, or spot a market angle? That is the bridge we cover here.`,
    '',
    '## Founder checklist',
    '',
    '1. **What changed?** One paragraph on the underlying news or product shift.',
    '2. **Who is affected?** Indian startups, global SaaS, developers, marketers — be specific.',
    '3. **Which AI layer helps?** Research agent, writing tools, coding assistant, or LLM default.',
    '4. **Security / data risk?** Customer data in prompts? Prefer published posture over marketing claims.',
    '5. **Directory next step** — open the relevant One9Founders category and compare before buying.',
    '',
    '## Explore on One9Founders',
    '',
    hookLines,
    '',
    '## Independence note',
    '',
    'One9Founders lists tools for discovery and comparison. Listing does **not** mean we are affiliated with or endorsed by those vendors. See [Privacy — Directory Listings](https://www.one9founders.com/privacy) and [Methodology](https://www.one9founders.com/methodology).',
    '',
    item.link
      ? `## Trend source\n\n[Google Trends / related coverage](${item.link})\n`
      : '',
    '## Editor TODO',
    '',
    '- [ ] Replace checklist bullets with real analysis (facts + founder angle)',
    '- [ ] Link 3–5 live `/tool/*` or `/agents/*` or `/llms/*` pages',
    '- [ ] Add India/INR note if relevant',
    '- [ ] Promote into `src/lib/blog.ts` (or sheet → `npm run content:generate`)',
    '- [ ] Delete this draft file after publish',
    '',
  ]
    .filter((line) => line !== null)
    .join('\n');
}

async function main() {
  const date = todayIso();
  await mkdir(DRAFT_DIR, { recursive: true });
  const existing = new Set(await readdir(DRAFT_DIR));

  const collected: TrendItem[] = [];
  for (const geo of DEFAULT_GEOS) {
    try {
      const items = await fetchGeoTrends(geo);
      console.log(`fetched ${items.length} trends for ${geo}`);
      collected.push(...items);
    } catch (err) {
      console.error(err instanceof Error ? err.message : err);
    }
  }

  // Prefer higher approx traffic when present; otherwise keep RSS order, de-dupe by title.
  const byTitle = new Map<string, TrendItem>();
  for (const item of collected) {
    const key = item.title.toLowerCase();
    const prev = byTitle.get(key);
    if (!prev) {
      byTitle.set(key, item);
      continue;
    }
    const prevN = Number(String(prev.approxTraffic || '0').replace(/[^\d]/g, '')) || 0;
    const nextN = Number(String(item.approxTraffic || '0').replace(/[^\d]/g, '')) || 0;
    if (nextN > prevN) byTitle.set(key, item);
  }

  const ranked = [...byTitle.values()]
    .map((item) => ({ item, score: relevanceScore(item.title) }))
    .filter(({ score }) => score >= 8)
    .sort((a, b) => b.score - a.score)
    .slice(0, LIMIT)
    .map(({ item }) => item);

  if (ranked.length === 0) {
    console.log(
      'No founder/AI-relevant trends cleared the relevance filter. Try another geo or lower the bar later.'
    );
  }

  let written = 0;
  let skipped = 0;

  for (const item of ranked) {
    const filename = `${date}-${slugify(item.title)}.mdx`;
    if (existing.has(filename)) {
      skipped += 1;
      continue;
    }
    await writeFile(join(DRAFT_DIR, filename), renderDraft(item, date), 'utf8');
    existing.add(filename);
    written += 1;
    console.log(`wrote content/blog/drafts/${filename}`);
  }

  console.log(
    `content:trends summary: geos=${DEFAULT_GEOS.join(',')} candidates=${byTitle.size} written=${written} skipped_existing=${skipped}`
  );
  console.log(
    'Next: edit drafts, then promote approved posts into src/lib/blog.ts (live blog) or the content sheet.'
  );
}

main().catch((error) => {
  console.error(error instanceof Error ? error.message : error);
  process.exit(1);
});
