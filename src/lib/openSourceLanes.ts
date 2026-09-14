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
      'llamafile', 'llama.cpp', 'ollama', 'vllm', 'gguf', 'mlx',
      'local model', 'local llm', 'run llms', 'run llm', 'open-weight',
      'open weight', 'text-generation-webui', 'inference server',
      'distribute and run llms', 'single file',
    ],
  },
  {
    id: 'agents',
    needles: [
      'agent', 'autonomous', 'multi-agent', 'orchestration', 'crewai',
      'langchain agent', 'tool use', 'tool-calling', 'swarm', 'browser agent',
      'memories, knowledge and tools', 'manage memories',
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
      'guardrail', 'red team', 'session replay', 'feature flags',
    ],
  },
  {
    id: 'coding',
    needles: [
      'coding assistant', 'code assistant', 'ide', 'copilot', 'cursor',
      'vscode', 'refactor', 'pull request', 'github action', 'cli for',
      'developer tool', 'static analysis', 'recursively searches',
    ],
  },
  {
    id: 'infra',
    needles: [
      'postgres', 'database', 'self-host', 'self host',
      'kubernetes', 'docker', 'backend', 'infrastructure',
      'api gateway', 'development platform',
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
  let best: { id: OpenSourceLaneId; score: number } | null = null;
  for (const { id, needles } of KEYWORD_LANES) {
    let score = 0;
    for (const needle of needles) {
      if (haystack.includes(needle)) {
        // Longer phrases are more specific ("stable diffusion" > "audio").
        score += Math.max(1, Math.min(4, Math.ceil(needle.length / 6)));
      }
    }
    if (score > 0 && (!best || score > best.score)) {
      best = { id, score };
    }
  }
  return best ? LANE_BY_ID[best.id] : LANE_BY_ID.other;
}

export function openSourceLaneLabel(id: OpenSourceLaneId): string {
  return LANE_BY_ID[id].label;
}

export function isOpenSourceLaneId(
  value: string | null | undefined,
): value is OpenSourceLaneId {
  return !!value && value in LANE_BY_ID;
}

export function emptyLaneCounts(): Record<OpenSourceLaneId, number> {
  return Object.fromEntries(
    OPEN_SOURCE_LANES.map((lane) => [lane.id, 0]),
  ) as Record<OpenSourceLaneId, number>;
}

export function countByLane(tools: Tool[]): Record<OpenSourceLaneId, number> {
  const counts = emptyLaneCounts();
  for (const tool of tools) {
    counts[inferOpenSourceLane(tool).id] += 1;
  }
  return counts;
}
