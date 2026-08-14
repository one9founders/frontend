import { daysAgoIsoDate, writePipelineJson } from '../io';

export interface GithubRepo {
  name: string;
  url: string;
  description: string;
  stars: number;
  language: string;
  pushedAt: string;
}

interface GithubSearchItem {
  name?: string;
  html_url?: string;
  description?: string | null;
  stargazers_count?: number;
  language?: string | null;
  pushed_at?: string;
}

interface GithubSearchResponse {
  items?: GithubSearchItem[];
  message?: string;
}

export async function fetchGithubRepos(): Promise<GithubRepo[]> {
  const token = process.env.GITHUB_TOKEN;
  if (!token) {
    throw new Error(
      'GITHUB_TOKEN is missing. Set process.env.GITHUB_TOKEN before running the GitHub pipeline source.'
    );
  }

  const since = daysAgoIsoDate(7);
  const query = `(topic:artificial-intelligence OR topic:llm) pushed:>=${since}`;
  const url = new URL('https://api.github.com/search/repositories');
  url.searchParams.set('q', query);
  url.searchParams.set('sort', 'stars');
  url.searchParams.set('order', 'desc');
  url.searchParams.set('per_page', '50');

  const response = await fetch(url, {
    headers: {
      Accept: 'application/vnd.github+json',
      Authorization: `Bearer ${token}`,
      'User-Agent': 'one9founders-pipeline',
      'X-GitHub-Api-Version': '2022-11-28',
    },
  });

  const data = (await response.json()) as GithubSearchResponse;
  if (!response.ok) {
    throw new Error(`GitHub search failed (${response.status}): ${data.message || response.statusText}`);
  }

  return (data.items || []).map((item) => ({
    name: item.name || '',
    url: item.html_url || '',
    description: item.description || '',
    stars: item.stargazers_count ?? 0,
    language: item.language || '',
    pushedAt: item.pushed_at || '',
  }));
}

export async function runGithubSource(): Promise<GithubRepo[]> {
  const repos = await fetchGithubRepos();
  await writePipelineJson('github-repos.json', repos);
  return repos;
}

if (import.meta.url === new URL(process.argv[1] ?? '', 'file:').href || process.argv[1]?.endsWith('github.ts')) {
  runGithubSource()
    .then((repos) => console.log(`github: ${repos.length} repos`))
    .catch((error) => {
      console.error(error);
      process.exit(1);
    });
}
