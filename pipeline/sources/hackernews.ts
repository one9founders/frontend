import { writePipelineJson } from '../io';

export interface HackerNewsStory {
  title: string;
  url: string;
  points: number;
  numComments: number;
  createdAt: string;
}

interface AlgoliaHit {
  title?: string | null;
  url?: string | null;
  story_url?: string | null;
  points?: number | null;
  num_comments?: number | null;
  created_at?: string;
}

interface AlgoliaSearchResponse {
  hits?: AlgoliaHit[];
}

export async function fetchHackerNewsStories(): Promise<HackerNewsStory[]> {
  const response = await fetch('http://hn.algolia.com/api/v1/search_by_date?query=AI&tags=story', {
    headers: { 'User-Agent': 'one9founders-pipeline' },
  });

  if (!response.ok) {
    throw new Error(`Hacker News search failed (${response.status}): ${response.statusText}`);
  }

  const data = (await response.json()) as AlgoliaSearchResponse;
  return (data.hits || []).map((hit) => ({
    title: hit.title || '',
    url: hit.url || hit.story_url || '',
    points: hit.points ?? 0,
    numComments: hit.num_comments ?? 0,
    createdAt: hit.created_at || '',
  }));
}

export async function runHackerNewsSource(): Promise<HackerNewsStory[]> {
  const stories = await fetchHackerNewsStories();
  await writePipelineJson('hn-stories.json', stories);
  return stories;
}

if (process.argv[1]?.endsWith('hackernews.ts')) {
  runHackerNewsSource()
    .then((stories) => console.log(`hackernews: ${stories.length} stories`))
    .catch((error) => {
      console.error(error);
      process.exit(1);
    });
}
