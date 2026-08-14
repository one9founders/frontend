import { allInnerTags, daysAgoIsoDate, innerTag, writePipelineJson } from '../io';

export interface ArxivPaper {
  title: string;
  summary: string;
  authors: string[];
  link: string;
  published: string;
}

function arxivDateStamp(isoDate: string, endOfDay = false): string {
  return `${isoDate.replace(/-/g, '')}${endOfDay ? '2359' : '0000'}`;
}

function entryLink(entry: string): string {
  const alternate =
    entry.match(/<link[^>]*rel=["']alternate["'][^>]*href=["']([^"']+)["']/i) ||
    entry.match(/<link[^>]*href=["']([^"']+)["'][^>]*rel=["']alternate["']/i);
  if (alternate?.[1]) return alternate[1];
  return entry.match(/<link[^>]*href=["']([^"']+)["']/i)?.[1] || innerTag(entry, 'id');
}

function parseAtomEntries(xml: string): ArxivPaper[] {
  const entries = [...xml.matchAll(/<entry\b[^>]*>([\s\S]*?)<\/entry>/gi)].map((match) => match[1]);
  return entries.map((entry) => {
    const authorBlocks = [...entry.matchAll(/<author\b[^>]*>([\s\S]*?)<\/author>/gi)].map((match) => match[1]);
    const authors = authorBlocks.map((block) => innerTag(block, 'name')).filter(Boolean);
    return {
      title: innerTag(entry, 'title').replace(/\s+/g, ' '),
      summary: innerTag(entry, 'summary').replace(/\s+/g, ' '),
      authors: authors.length > 0 ? authors : allInnerTags(entry, 'name'),
      link: entryLink(entry),
      published: innerTag(entry, 'published') || innerTag(entry, 'updated'),
    };
  });
}

export async function fetchArxivPapers(): Promise<ArxivPaper[]> {
  const start = arxivDateStamp(daysAgoIsoDate(7));
  const end = arxivDateStamp(new Date().toISOString().slice(0, 10), true);
  const searchQuery = `(cat:cs.AI OR cat:cs.LG) AND submittedDate:[${start} TO ${end}]`;
  const url = new URL('http://export.arxiv.org/api/query');
  url.searchParams.set('search_query', searchQuery);
  url.searchParams.set('sortBy', 'submittedDate');
  url.searchParams.set('sortOrder', 'descending');
  url.searchParams.set('max_results', '50');

  const response = await fetch(url, {
    headers: { 'User-Agent': 'one9founders-pipeline/1.0 (hello@one9founders.com)' },
  });

  if (!response.ok) {
    throw new Error(`arXiv query failed (${response.status}): ${response.statusText}`);
  }

  return parseAtomEntries(await response.text());
}

export async function runArxivSource(): Promise<ArxivPaper[]> {
  const papers = await fetchArxivPapers();
  await writePipelineJson('arxiv-papers.json', papers);
  return papers;
}

if (process.argv[1]?.endsWith('arxiv.ts')) {
  runArxivSource()
    .then((papers) => console.log(`arxiv: ${papers.length} papers`))
    .catch((error) => {
      console.error(error);
      process.exit(1);
    });
}
