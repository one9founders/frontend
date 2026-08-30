import type { Tool, ToolTrack } from '@/types';

export const TRACK_LABELS: Record<ToolTrack, string> = {
  ai_tool: 'AI Tools',
  ai_agent: 'AI Agents',
  open_source: 'Open Source',
  agent_skill: 'Agent Skills',
  mcp_server: 'MCP Servers',
};

export const SELF_HOST_TRACKS: ReadonlySet<ToolTrack> = new Set([
  'open_source',
  'agent_skill',
  'mcp_server',
]);

export type OpenSourceKind = 'repos' | 'skills' | 'mcp';

export const OPEN_SOURCE_TABS: {
  kind: OpenSourceKind;
  track: ToolTrack;
  label: string;
  blurb: string;
}[] = [
  {
    kind: 'repos',
    track: 'open_source',
    label: 'Repos',
    blurb: 'GitHub projects you can clone, self-host, or call as an API.',
  },
  {
    kind: 'skills',
    track: 'agent_skill',
    label: 'Skills',
    blurb: 'SKILL.md packs you can drop into Claude, Cursor, or an agent.',
  },
  {
    kind: 'mcp',
    track: 'mcp_server',
    label: 'MCP servers',
    blurb: 'Model Context Protocol servers that plug tools into an agent.',
  },
];

export function isToolTrack(value: string | null | undefined): value is ToolTrack {
  return !!value && value in TRACK_LABELS;
}

export function isSelfHostTrack(track: Tool['track'] | undefined): boolean {
  return !!track && SELF_HOST_TRACKS.has(track);
}

export function openSourceTabFromKind(kind: string | null | undefined) {
  return OPEN_SOURCE_TABS.find((tab) => tab.kind === kind) ?? OPEN_SOURCE_TABS[0];
}

export function openSourceHref(kind?: OpenSourceKind) {
  if (!kind || kind === 'repos') return '/open-source';
  return `/open-source?kind=${kind}`;
}
