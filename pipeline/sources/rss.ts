import { readFile } from 'node:fs/promises';
import { join } from 'node:path';
import { innerTag, writePipelineJson } from '../io';

export interface RssFeedConfig {
  name: string;
  url: string;
  jobCluster: string;
}

export interface RssItem {
  title: string;
  link: string;
  summary: string;
  published: string;
  source: string;
  jobCluster: string;
}

function parseFeedsConfig(raw: string): RssFeedConfig[] {
  const stripped = raw
    .replace(/\/\*[\s\S]*?\*\//g, '')
    .replace(/^\s*\/\/.*$/gm, '')
    .trim();
  const parsed = JSON.parse(stripped) as unknown;
  if (!Array.isArray(parsed)) {
    throw new Error('pipeline/feeds.json must be an array of { name, url, jobCluster }');
  }
  return parsed as RssFeedConfig[];
}

function itemLink(block: string): string {
  const href = block.match(/<link[^>]*href=["']([^"']+)["']/i)?.[1];
  if (href) return href;
  return innerTag(block, 'link') || innerTag(block, 'guid') || innerTag(block, 'id');
}

function parseFeedItems(xml: string, feed: RssFeedConfig): RssItem[] {
  const rssItems = [...xml.matchAll(/<item\b[^>]*>([\s\S]*?)<\/item>/gi)].map((match) => match[1]);
  const atomEntries = [...xml.matchAll(/<entry\b[^>]*>([\s\S]*?)<\/entry>/gi)].map((match) => match[1]);
  const blocks = rssItems.length > 0 ? rssItems : atomEntries;

  return blocks.map((block) => ({
    title: innerTag(block, 'title').replace(/\s+/g, ' '),
    link: itemLink(block),
    summary: (
      innerTag(block, 'description') ||
      innerTag(block, 'summary') ||
      innerTag(block, 'content')
    ).replace(/\s+/g, ' '),
    published:
      innerTag(block, 'pubDate') ||
      innerTag(block, 'published') ||
      innerTag(block, 'updated') ||
      innerTag(block, 'dc:date'),
    source: feed.name,
    jobCluster: feed.jobCluster,
  }));
}

async function fetchOneFeed(feed: RssFeedConfig): Promise<RssItem[]> {
  const response = await fetch(feed.url, {
    headers: { 'User-Agent': 'one9founders-pipeline', Accept: 'application/rss+xml, application/atom+xml, application/xml, text/xml' },
  });
  if (!response.ok) {
    throw new Error(`HTTP ${response.status} ${response.statusText}`);
  }
  return parseFeedItems(await response.text(), feed);
}

export async function fetchRssItems(): Promise<RssItem[]> {
  const raw = await readFile(join(process.cwd(), 'pipeline', 'feeds.json'), 'utf8');
  const feeds = parseFeedsConfig(raw);
  const items: RssItem[] = [];

  for (const feed of feeds) {
    try {
      const feedItems = await fetchOneFeed(feed);
      items.push(...feedItems);
    } catch (error) {
      const message = error instanceof Error ? error.message : String(error);
      console.error(`Skipping feed "${feed.name}" (${feed.url}): ${message}`);
    }
  }

  return items;
}

export async function runRssSource(): Promise<RssItem[]> {
  const items = await fetchRssItems();
  await writePipelineJson('rss-items.json', items);
  return items;
}

if (process.argv[1]?.endsWith('rss.ts')) {
  runRssSource()
    .then((items) => console.log(`rss: ${items.length} items`))
    .catch((error) => {
      console.error(error);
      process.exit(1);
    });
}
