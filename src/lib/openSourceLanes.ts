import type { Tool, ToolTrack } from '@/types';

/**
 * Founder-facing job lanes for the open-source directory.
 * ICP: early teams who need to know "what can I ship with this?"
 * at a glance — not SaaS marketing categories.
 */
export type OpenSourceLaneId =
  | 'local-models'
  | 'agents'
  | 'rag'
  | 'image-media'
  | 'eval'
  | 'coding'
  | 'infra'
  | 'mcp'
  | 'skills'
  | 'other';

export type OpenSourceLane = {
  id: OpenSourceLaneId;
  label: string;
  /** One line founders read when filtering. */
  hint: string;
};

export const OPEN_SOURCE_LANES: OpenSourceLane[] = [
  {
    id: 'local-models',
    label: 'Local models',
    hint: 'Run or serve LLMs on your own machine',
  },
  {
    id: 'agents',
    label: 'Agents',
    hint: 'Orchestration, memory, and tool-using agents',
  },
  {
    id: 'rag',
    label: 'RAG & search',
    hint: 'Retrieval, embeddings, and knowledge bases',
  },
  {
    id: 'image-media',
    label: 'Image & media',
    hint: 'Diffusion, voice, video, multimodal',
  },
  {
    id: 'eval',
    label: 'Eval & observability',
    hint: 'Testing, tracing, and quality loops',
  },
  {
    id: 'coding',
    label: 'Coding tools',
    hint: 'Assistants, CLIs, and repo workflows',
  },
  {
    id: 'infra',
    label: 'Infra & platforms',
    hint: 'Databases, backends, and self-host stacks',
  },
  {
    id: 'mcp',
    label: 'MCP servers',
    hint: 'Tools that plug into agent runtimes',
  },
  {
    id: 'skills',
    label: 'Skills',
    hint: 'SKILL.md packs for Claude, Cursor, agents',
  },
  {
    id: 'other',
    label: 'Other',
    hint: 'Useful repos that do not fit a lane yet',
  },
];

const LANE_BY_ID = Object.fromEntries(
  OPEN_SOURCE_LANES.map((lane) => [lane.id, lane]),
) as Record<OpenSourceLaneId, OpenSourceLane>;

const KEYWORD_LANES: { id: OpenSourceLaneId; needles: string[] }[] = [
  {
    id: 'local-models',
    needles: [
      'llama', 'llm', 'gguf', 'ollama', 'vllm', 'inference', 'open-weight',
      'open weight', 'local model', 'language model', 'gpt-oss', 'mlx',
      'llamafile', 'llama.cpp', 'text-generation', 'chat model',
    ],
  },
  {
    id: 'agents',
    needles: [
      'agent', 'autonomous', 'multi-agent', 'orchestration', 'crewai',
      'langchain agent', 'tool use', 'tool-calling', 'swarm', 'browser agent',
    ],
  },
  {
    id: 'rag',
    needles: [
      'rag', 'retrieval', 'vector', 'embedding', 'knowledge base',
      'semantic search', 'chunk', 'retriever', 'pinecone', 'chroma',
      'weaviate', 'qdrant', 'memory for llm',
    ],
  },
  {
    id: 'image-media',
    needles: [
      'stable diffusion', 'diffusion', 'image generation', 'comfyui',
      'automatic1111', 'whisper', 'tts', 'speech', 'voice', 'video',
      'multimodal', 'vision', 'audio', 'sdxl', 'flux',
    ],
  },
  {
    id: 'eval',
    needles: [
      'eval', 'evaluation', 'observability', 'tracing', 'langsmith',
      'benchmark', 'prompt testing', 'monitoring', 'hallucination',
      'guardrail', 'red team',
    ],
  },
  {
    id: 'coding',
    needles: [
      'coding assistant', 'code assistant', 'ide', 'copilot', 'cursor',
      'vscode', 'refactor', 'pull request', 'github action', 'cli for',
      'developer tool', 'static analysis',
    ],
  },
  {
    id: 'infra',
    needles: [
      'postgres', 'database', 'self-host', 'self host', 'platform',
      'kubernetes', 'docker', 'backend', 'supabase', 'posthog',
      'infrastructure', 'deploy', 'api gateway',
    ],
  },
];

function haystackFor(tool: Tool): string {
  const parts = [
    tool.name,
    tool.slug,
    tool.short_description,
    tool.description,
    ...(tool.tags || []),
    ...(tool.use_cases || []),
    ...(tool.categories || []).map((c) => `${c.name} ${c.slug}`),
  ];
  return parts.filter(Boolean).join(' ').toLowerCase();
}

function trackLane(track: ToolTrack | undefined): OpenSourceLaneId | null {
  if (track === 'mcp_server') return 'mcp';
  if (track === 'agent_skill') return 'skills';
  return null;
}

/** Resolve the founder-facing lane for a directory row. */
export function inferOpenSourceLane(tool: Tool): OpenSourceLane {
  const fromTrack = trackLane(tool.track);
  if (fromTrack) return LANE_BY_ID[fromTrack];

  const haystack = haystackFor(tool);
  for (const { id, needles } of KEYWORD_LANES) {
    if (needles.some((needle) => haystack.includes(needle))) {
      return LANE_BY_ID[id];
    }
  }
  return LANE_BY_ID.other;
}

export function openSourceLaneLabel(id: OpenSourceLaneId): string {
  return LANE_BY_ID[id].label;
}

export function countByLane(tools: Tool[]): Record<OpenSourceLaneId, number> {
  const counts = Object.fromEntries(
    OPEN_SOURCE_LANES.map((lane) => [lane.id, 0]),
  ) as Record<OpenSourceLaneId, number>;
  for (const tool of tools) {
    counts[inferOpenSourceLane(tool).id] += 1;
  }
  return counts;
}
