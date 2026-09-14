import type { Tool } from '@/types';

export type GithubRepoRef = {
  owner: string;
  repo: string;
  fullName: string;
  url: string;
};

/** Pull owner/repo from a github.com URL when present. */
export function parseGithubRepo(
  url: string | null | undefined,
): GithubRepoRef | null {
  if (!url) return null;
  try {
    const parsed = new URL(url);
    if (!/(^|\.)github\.com$/i.test(parsed.hostname)) return null;
    const parts = parsed.pathname.split('/').filter(Boolean);
    if (parts.length < 2) return null;
    const owner = parts[0];
    const repo = parts[1].replace(/\.git$/i, '');
    if (!owner || !repo) return null;
    return {
      owner,
      repo,
      fullName: `${owner}/${repo}`,
      url: `https://github.com/${owner}/${repo}`,
    };
  } catch {
    return null;
  }
}

/** Best GitHub URL for a tool: source row, then website. */
export function githubRefForTool(tool: Tool): GithubRepoRef | null {
  const fromSources = (tool.sources || [])
    .filter((row) => row.source === 'github' || /github\.com/i.test(row.url))
    .map((row) => parseGithubRepo(row.url))
    .find(Boolean);
  if (fromSources) return fromSources;
  return parseGithubRepo(tool.website);
}

/** Strip leading emoji / noise so the one-liner reads cleanly. */
export function cleanRepoBlurb(text: string | null | undefined): string {
  if (!text) return '';
  return text
    .replace(/^[\s:]*[\p{Extended_Pictographic}\uFE0F\u200D]+\s*/u, '')
    .replace(/\s+/g, ' ')
    .trim();
}
