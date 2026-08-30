import { STATS, formatCatalogCount } from '@/lib/constants/stats';

export type EcosystemGroup = 'catalog' | 'build';
export type CountKind = 'tools' | 'agents' | 'openSource' | 'llms' | 'rag' | 'research' | null;

export type EcosystemItem = {
  id: string;
  name: string;
  blurb: string;
  href: string;
  group: EcosystemGroup;
  countKind: CountKind;
};

export const ECOSYSTEM: EcosystemItem[] = [
  {
    id: 'tools',
    name: 'AI Tools',
    blurb: 'Rated, comparable, INR-aware.',
    href: '/#tools-section',
    group: 'catalog',
    countKind: 'tools',
  },
  {
    id: 'open-source',
    name: 'Open Source',
    blurb: 'Repos, skills, MCP. Run locally.',
    href: '/open-source',
    group: 'catalog',
    countKind: 'openSource',
  },
  {
    id: 'new',
    name: 'New',
    blurb: 'Just listed. Still being assessed.',
    href: '/new',
    group: 'catalog',
    countKind: null,
  },
  {
    id: 'agents',
    name: 'Agents',
    blurb: 'Workflows that take action.',
    href: '/agents',
    group: 'catalog',
    countKind: 'agents',
  },
  {
    id: 'llms',
    name: 'LLMs',
    blurb: 'Benchmarks, cost, context window.',
    href: '/llms',
    group: 'catalog',
    countKind: 'llms',
  },
  {
    id: 'rag',
    name: 'RAG & Vector DBs',
    blurb: 'Retrieval systems, compared.',
    href: '/rag-vector-dbs',
    group: 'catalog',
    countKind: 'rag',
  },
  {
    id: 'research',
    name: 'Research',
    blurb: 'Papers from arXiv and Hugging Face.',
    href: '/research',
    group: 'catalog',
    countKind: 'research',
  },
  {
    id: 'stack',
    name: 'Assemble a stack',
    blurb: 'Tell us the job. Get a free-first stack.',
    href: '/stack',
    group: 'build',
    countKind: null,
  },
  {
    id: 'stacks',
    name: 'Founder stacks',
    blurb: 'Curated kits with INR pricing.',
    href: '/stacks',
    group: 'build',
    countKind: null,
  },
  {
    id: 'fintech',
    name: 'Fintech',
    blurb: 'RBI, DPDP, India-fit checks.',
    href: '/fintech',
    group: 'build',
    countKind: null,
  },
  {
    id: 'worker',
    name: 'One9 Worker',
    blurb: 'Local coworker. Keys stay on the machine.',
    href: '/worker',
    group: 'build',
    countKind: null,
  },
];

export const CATALOG = ECOSYSTEM.filter((item) => item.group === 'catalog');
export const BUILD = ECOSYSTEM.filter((item) => item.group === 'build');

const BOARD_IDS = new Set([
  'tools',
  'open-source',
  'agents',
  'llms',
  'rag',
  'stack',
  'fintech',
  'worker',
]);

export const BOARD = ECOSYSTEM.filter((item) => BOARD_IDS.has(item.id));

export function itemCount(
  item: EcosystemItem,
  live: { tools?: number | null; agents?: number | null; openSource?: number | null },
): string | null {
  switch (item.countKind) {
    case 'tools':
      return formatCatalogCount(live.tools, STATS.totalResources);
    case 'agents':
      return formatCatalogCount(live.agents, STATS.aiAgents);
    case 'openSource':
      return formatCatalogCount(live.openSource, '140+', 10);
    case 'llms':
      return STATS.llmsCompared;
    case 'rag':
      return STATS.ragVectorDbs;
    case 'research':
      return STATS.researchPapers;
    default:
      return null;
  }
}
