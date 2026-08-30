import type {
  CategoryStat,
  DirectoryStats,
  Tool,
  ToolTrack,
  TrackStat,
} from '@/types';
import { isToolTrack, TRACK_LABELS } from '@/lib/constants/tracks';

const API_URL = process.env.NEXT_PUBLIC_API_URL || 'https://api.one9founders.com';

function optionalCount(value: unknown): number | null {
  if (value == null || value === '') return null;
  const n = Number(value);
  return Number.isFinite(n) && n >= 0 ? n : null;
}

function normalizeKey(value: string): string {
  return value.trim().toLowerCase().replace(/[_\s]+/g, '-');
}

function parseByCategory(raw: unknown): CategoryStat[] {
  if (Array.isArray(raw)) {
    return raw.flatMap((row) => {
      if (!row || typeof row !== 'object') return [];
      const r = row as Record<string, unknown>;
      const count = optionalCount(r.count);
      if (count == null) return [];
      const category = String(r.category ?? r.name ?? r.slug ?? '').trim();
      if (!category) return [];
      return [{
        category,
        slug: r.slug != null ? String(r.slug) : undefined,
        name: r.name != null ? String(r.name) : undefined,
        count,
      }];
    });
  }

  if (raw && typeof raw === 'object') {
    return Object.entries(raw as Record<string, unknown>).flatMap(([category, count]) => {
      const n = optionalCount(count);
      if (n == null || !category) return [];
      return [{ category, count: n }];
    });
  }

  return [];
}

function parseByTrack(raw: unknown): TrackStat[] {
  if (!Array.isArray(raw)) return [];
  return raw.flatMap((row) => {
    if (!row || typeof row !== 'object') return [];
    const r = row as Record<string, unknown>;
    const track = String(r.track ?? '').trim();
    if (!isToolTrack(track)) return [];
    const count = optionalCount(r.count);
    if (count == null) return [];
    return [{
      track,
      label: String(r.label ?? TRACK_LABELS[track]),
      count,
    }];
  });
}

export function parseDirectoryStats(data: unknown): DirectoryStats {
  const raw = data && typeof data === 'object' ? (data as Record<string, unknown>) : {};
  const total = optionalCount(raw.total_tools) ?? optionalCount(raw.count);
  return {
    total_tools: total,
    count: total,
    fully_assessed_count: optionalCount(raw.fully_assessed_count),
    provisionally_assessed_count: optionalCount(raw.provisionally_assessed_count),
    agent_count: optionalCount(raw.agent_count),
    by_category: parseByCategory(raw.by_category),
    by_track: parseByTrack(raw.by_track),
  };
}

export async function fetchDirectoryStats(): Promise<DirectoryStats | null> {
  try {
    const response = await fetch(`${API_URL}/tools/stats/`, {
      next: { revalidate: 3600 },
    });
    if (!response.ok) return null;
    return parseDirectoryStats(await response.json());
  } catch (error) {
    console.error('Get directory stats error:', error);
    return null;
  }
}

export function getCategoryCount(
  stats: DirectoryStats | null | undefined,
  slug: string,
  name?: string,
): number | null {
  if (!stats?.by_category.length) return null;
  const keys = new Set(
    [slug, name].filter((value): value is string => Boolean(value)).map(normalizeKey),
  );
  const match = stats.by_category.find((row) =>
    [row.category, row.slug, row.name]
      .filter((value): value is string => Boolean(value))
      .some((value) => keys.has(normalizeKey(value))),
  );
  return match ? match.count : null;
}

export function getTrackCount(
  stats: DirectoryStats | null | undefined,
  track: ToolTrack,
): number | null {
  const match = stats?.by_track?.find((row) => row.track === track);
  return match ? match.count : null;
}

export async function fetchToolsByTrack(
  track: ToolTrack,
  pageSize = 12,
  page = 1,
): Promise<{ tools: Tool[]; count: number }> {
  try {
    const query = new URLSearchParams({
      track,
      page: String(page),
      page_size: String(pageSize),
    });
    const response = await fetch(`${API_URL}/tools/?${query.toString()}`, {
      next: { revalidate: 600 },
      signal: AbortSignal.timeout(12000),
    });
    if (!response.ok) return { tools: [], count: 0 };
    const data = await response.json();
    if (data && typeof data === 'object' && Array.isArray(data.results)) {
      return { tools: data.results, count: optionalCount(data.count) ?? data.results.length };
    }
    const tools = Array.isArray(data) ? data : [];
    return { tools, count: tools.length };
  } catch (error) {
    console.error('Get tools by track error:', error);
    return { tools: [], count: 0 };
  }
}
