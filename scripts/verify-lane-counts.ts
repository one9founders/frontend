import { countByLane, OPEN_SOURCE_LANES, inferOpenSourceLane } from '../src/lib/openSourceLanes';
import type { Tool } from '../src/types';

async function fetchAll(): Promise<Tool[]> {
  const all: Tool[] = [];
  let page = 1;
  let next = true;
  while (next) {
    const res = await fetch(
      `https://api.one9founders.com/tools/?track=open_source&page=${page}&page_size=100`,
      { headers: { 'User-Agent': 'Mozilla/5.0', Accept: 'application/json' } },
    );
    const data = await res.json();
    all.push(...(data.results || []));
    next = !!data.next;
    page += 1;
    if (page > 40) break;
  }
  return all;
}

async function main() {
  const tools = await fetchAll();
  const counts = countByLane(tools);
  const ordered = OPEN_SOURCE_LANES.map((l) => [l.label, counts[l.id]] as const)
    .filter(([, n]) => n > 0)
    .sort((a, b) => b[1] - a[1]);
  for (const [label, n] of ordered) console.log(String(n).padStart(4), label);
  const sum = Object.values(counts).reduce((a, b) => a + b, 0);
  const other = tools.filter((t) => inferOpenSourceLane(t).id === 'other').length;
  console.log('sum', sum, 'other', other, 'counts.other', (counts as Record<string, number>).other ?? 0);
}

main();
