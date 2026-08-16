const API_URL = process.env.NEXT_PUBLIC_API_URL || 'https://api.one9founders.com';

export type StackCost = 'free' | 'skill' | 'paid' | 'worker';

export type StackLaneItem = {
  slug: string | null;
  name: string;
  note: string;
  cost: StackCost | string;
  cost_label: string;
  href?: string;
  track?: string;
};

export type StackLane = {
  id: string;
  label: string;
  items: StackLaneItem[];
};

export type JobStack = {
  public_id: string;
  query: string;
  title: string;
  blurb: string;
  cash_out: string;
  source: 'agent' | 'person';
  lanes: StackLane[];
  created_at: string | null;
  url_path: string;
};

const RECENT_KEY = 'one9_recent_stacks';

export type RecentStack = {
  public_id: string;
  title: string;
  query: string;
  created_at: string | null;
};

async function parseError(res: Response): Promise<string> {
  const data = await res.json().catch(() => ({}));
  return data.error || data.detail || res.statusText || 'Request failed';
}

export async function assembleJobStack(query: string): Promise<JobStack> {
  const res = await fetch(`${API_URL}/stacks/assemble/`, {
    method: 'POST',
    credentials: 'include',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ query, source: 'agent' }),
  });
  if (!res.ok) throw new Error(await parseError(res));
  return res.json();
}

export async function savePersonStack(payload: {
  query: string;
  title?: string;
  blurb?: string;
  cash_out?: string;
  lanes: StackLane[];
}): Promise<JobStack> {
  const res = await fetch(`${API_URL}/stacks/`, {
    method: 'POST',
    credentials: 'include',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(payload),
  });
  if (!res.ok) throw new Error(await parseError(res));
  return res.json();
}

export async function fetchJobStack(publicId: string): Promise<JobStack | null> {
  const res = await fetch(`${API_URL}/stacks/${encodeURIComponent(publicId)}/`, {
    cache: 'no-store',
  });
  if (res.status === 404) return null;
  if (!res.ok) throw new Error(await parseError(res));
  return res.json();
}

export function rememberRecentStack(stack: Pick<JobStack, 'public_id' | 'title' | 'query' | 'created_at'>) {
  if (typeof window === 'undefined') return;
  const next: RecentStack[] = [
    {
      public_id: stack.public_id,
      title: stack.title,
      query: stack.query,
      created_at: stack.created_at,
    },
    ...readRecentStacks().filter((s) => s.public_id !== stack.public_id),
  ].slice(0, 8);
  localStorage.setItem(RECENT_KEY, JSON.stringify(next));
}

export function readRecentStacks(): RecentStack[] {
  if (typeof window === 'undefined') return [];
  try {
    const raw = localStorage.getItem(RECENT_KEY);
    const parsed = raw ? JSON.parse(raw) : [];
    return Array.isArray(parsed) ? parsed : [];
  } catch {
    return [];
  }
}
