import type { CategoryStat, DirectoryStats } from '@/types';

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
