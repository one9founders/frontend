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
  | 'chat-ui'
  | 'coding'
  | 'image-media'
  | 'training'
  | 'prompts-workflows'
  | 'llm-apis'
  | 'frameworks'
  | 'eval'
  | 'security'
  | 'writing-docs'
  | 'data-ops'
  | 'infra'
  | 'research'
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
    id: 'chat-ui',
    label: 'Chat & clients',
    hint: 'Chat UIs, copilots, and messaging frontends',
  },
  {
    id: 'coding',
    label: 'Coding tools',
    hint: 'Assistants, CLIs, and repo workflows',
  },
  {
    id: 'image-media',
    label: 'Image & media',
    hint: 'Diffusion, voice, video, multimodal',
  },
  {
    id: 'training',
    label: 'Train & fine-tune',
    hint: 'Fine-tuning, datasets, and model training loops',
  },
  {
    id: 'prompts-workflows',
    label: 'Prompts & workflows',
    hint: 'Prompt packs, templates, and automation flows',
  },
  {
    id: 'llm-apis',
    label: 'LLM APIs & gateways',
    hint: 'Proxies, routers, and multi-provider APIs',
  },
  {
    id: 'frameworks',
    label: 'Frameworks & SDKs',
    hint: 'Libraries to build GenAI apps faster',
  },
  {
    id: 'eval',
    label: 'Eval & observability',
    hint: 'Testing, tracing, and quality loops',
  },
  {
    id: 'security',
    label: 'AI security',
    hint: 'Safety, privacy, guardrails, and governance',
  },
  {
    id: 'writing-docs',
    label: 'Writing & docs',
    hint: 'Docs, papers, contracts, and authoring tools',
  },
  {
    id: 'data-ops',
    label: 'Data & automation',
    hint: 'Scraping, ETL, analytics, and browser automation',
  },
  {
    id: 'infra',
    label: 'Infra & platforms',
    hint: 'Databases, backends, and self-host stacks',
  },
  {
    id: 'research',
    label: 'Research & learning',
    hint: 'Papers, tutorials, curated lists, experiments',
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

/**
 * Keyword lanes scored against name/description/tags.
 * Longer needles score higher; short tokens use word boundaries.
 */
const KEYWORD_LANES: { id: OpenSourceLaneId; needles: string[] }[] = [
  {
    id: 'local-models',
    needles: [
      'llamafile', 'llama.cpp', 'llama-cpp', 'ollama', 'vllm', 'gguf', 'mlx',
      'local model', 'local llm', 'run llms', 'run llm', 'open-weight',
      'open weight', 'text-generation-webui', 'inference server',
      'local inference', 'cpu inference', 'run locally', 'running llms locally',
      'offline llm', 'on-device', 'on device', 'self-hosted llm', 'exllama',
      'kobold', 'lm studio', 'tensorrt-llm', 'hugging face locally',
      'run open source', 'weights locally', 'bodhi app', 'gerbil',
      'pytorch llms', 'curated transformers', 'gpt-j inference',
      'instruction-tuned', 'npcs running on your hardware',
    ],
  },
  {
    id: 'training',
    needles: [
      'fine-tune', 'finetune', 'fine tune', 'finetuning', 'fine-tuning',
      'train a', 'train llm', 'model training', 'lora', 'qlora', 'peft',
      'rlhf', 'dpo', 'sft', 'pretrain', 'pre-train', 'from scratch',
      'finetuning data', 'train your', 'continual backprop', 'ccbp',
      'learning flywheel', 'synthetic data',
    ],
  },
  {
    id: 'agents',
    needles: [
      'agent', 'autonomous', 'multi-agent', 'orchestration', 'crewai',
      'langchain agent', 'tool use', 'tool-calling', 'tool calling', 'swarm',
      'browser agent', 'memories, knowledge and tools', 'manage memories',
      'agentic', 'auto-gpt', 'autogpt', 'babyagi', 'langgraph',
      'computer use', 'browser control', 'drive your web browser',
      'operate your computer', 'auto-pilot', 'screen control',
      'ai assistant for your os',
    ],
  },
  {
    id: 'rag',
    needles: [
      'rag', 'retrieval', 'vector database', 'vector store', 'embedding',
      'embeddings', 'knowledge base', 'semantic search', 'chunking',
      'retriever', 'pinecone', 'chroma', 'weaviate', 'qdrant',
      'memory for llm', 'hybrid search', 'semantic grep', 'knowledge graph',
      'wiki generator', 'deepwiki', 'langextract', 'entity-relation',
      'sort lines semantically', 'llm context', 'llmfeeder',
    ],
  },
  {
    id: 'chat-ui',
    needles: [
      'chat ui', 'chatbot', 'chat bot', 'chat frontend', 'chat front end',
      'chatgpt', 'chat interface', 'llm chat', 'conversation ui',
      'slack bot', 'personal chat', 'chat assistant', 'secure chatgpt',
      'chatbox', 'sillytavern', 'llm frontend', 'ai client', 'character.ai',
      'overlapping chat', 'answers while you type', 'chat with gpt',
      'personal ai assistant', 'messaging frontend', 'call an ai from',
      'native ai assistants', 'siri like',
    ],
  },
  {
    id: 'coding',
    needles: [
      'coding assistant', 'code assistant', 'copilot', 'vscode',
      'refactor', 'pull request', 'github action', 'developer tool',
      'static analysis', 'code review', 'coding tool', 'tree-sitter',
      'claude code', 'openai codex', 'developer workspace', 'codebase',
      'cli assist', 'commit message', 'npm package', 'github cli',
      'terminal emulator', 'status line', 'ci/cd', 'ide extension',
      'ide plugin', 'code generation', 'programming assistant',
      'command-line', 'command line', 'llm based compiler', 'compiler to',
      'block programming', 'upgrade npm', 'git commit', 'cli helper',
    ],
  },
  {
    id: 'image-media',
    needles: [
      'stable diffusion', 'diffusion', 'image generation', 'comfyui',
      'automatic1111', 'whisper', 'tts', 'speech-to-text', 'text-to-speech',
      'text to speech', 'voice cloning', 'video generation', 'multimodal',
      'computer vision', 'audio generation', 'sdxl', 'flux', 'image editing',
      'dehazing', 'music generation', 'photos app', 'object detection', 'yolo',
      'photoprism', 'avatar generator', 'digital painting', 'heygen',
      'stories from images', 'ai wearable', 'neural rendering', 'dlss',
      'color palette',
    ],
  },
  {
    id: 'eval',
    needles: [
      'eval', 'evaluation', 'observability', 'tracing', 'langsmith',
      'benchmark', 'prompt testing', 'monitoring', 'hallucination',
      'session replay', 'feature flags', 'structural verification',
      'mutation testing', 'semantic checks', 'quality loop', 'llm bench',
      'testing llm', 'spans, traces', 'llm spans', 'root causes',
      'thought visualization', 'tokenflood', 'simulate arbitrary loads',
    ],
  },
  {
    id: 'prompts-workflows',
    needles: [
      'prompt engineering', 'prompt library', 'prompt pack', 'prompt template',
      'workflow', 'workflows', 'controlflow', 'n8n', 'zapier',
      'files to prompt', 'command-style prompts', 'reusable command',
      'automation flow', 'ai workflows', 'automate git',
    ],
  },
  {
    id: 'llm-apis',
    needles: [
      'openai api', 'anthropic', 'llm gateway', 'openai-compatible',
      'litellm', 'openrouter', 'model routing', 'structured output',
      'json output', 'function calling', 'compute gateway',
      'one api for', 'api for openai', 'multi-provider', 'llm proxy',
      'mcp proxy', 'stdio mcp', 'ai gateway', 'intelligence gateway',
      '350 providers', 'one endpoint', 'mcp tool', 'debug mcp',
    ],
  },
  {
    id: 'frameworks',
    needles: [
      'langchain alternative', 'llmflows', 'genai framework', 'llm framework',
      'sdk for', 'python library', 'structured outputs', 'outlines',
      'bot framework', 'build genai', 'genai apps', 'ai saas',
      'pip-installable', 'sequence small', 'template helps you start',
      'deep learning for humans', 'keras',
    ],
  },
  {
    id: 'security',
    needles: [
      'ai security', 'secure chatgpt', 'prompt injection', 'jailbreak',
      'pii redaction', 'guardrail', 'red team', 'ai governance',
      'ai assurance', 'failsafe', 'boundary guard', 'stench guard',
      'watermark', 'privacy for ai', 'safety for ai', 'secure stdio',
    ],
  },
  {
    id: 'writing-docs',
    needles: [
      'word processor', 'documentation', 'markdown', 'latex',
      'academic paper', 'storytelling', 'contract review', 'resume',
      'job description', 'writing tool', 'authoring', 'wiki generator',
      'cheatsheet', 'paper writing', 'docs generator', 'architecture review',
    ],
  },
  {
    id: 'data-ops',
    needles: [
      'data analysis', 'analytics', 'web scrape', 'scraping', 'crawler',
      'dataset', 'etl', 'data pipeline', 'spreadsheet', 'forecast',
      'browser automation', 'playwright', 'data loading', 'clean your data',
      'data bonsai', 'quant', 'ocr for screen', 'synthetic data',
      'junk data', 'trend analysis',
    ],
  },
  {
    id: 'research',
    needles: [
      'google research', 'arxiv', 'implementation of the', 'educational tool',
      'curated list', 'awesome ai', 'awesome generative', 'ai timeline',
      'cognitive map', 'landmark papers', 'machine learning research',
      'research paper', 'for researchers', 'source codes for the paper',
      'world models',
    ],
  },
  {
    id: 'infra',
    needles: [
      'postgres', 'database', 'self-host', 'self host', 'kubernetes',
      'docker', 'infrastructure', 'development platform', 'model registry',
      'server management', 'admin panel', 'desktop application',
      'linux server', 'machine-readable index',
    ],
  },
];

/** CMS category → lane when keyword score is missing or weak. */
const CATEGORY_LANE: Record<string, OpenSourceLaneId> = {
  code: 'coding',
  writing: 'writing-docs',
  security: 'security',
  research: 'research',
  education: 'research',
  automation: 'prompts-workflows',
  chatbots: 'chat-ui',
  'data analysis': 'data-ops',
  analytics: 'data-ops',
  documents: 'writing-docs',
  images: 'image-media',
  design: 'image-media',
  search: 'rag',
  productivity: 'prompts-workflows',
  translation: 'writing-docs',
  '3d': 'image-media',
  healthcare: 'research',
  legal: 'writing-docs',
  finance: 'data-ops',
  marketing: 'writing-docs',
  'social media': 'chat-ui',
  development: 'coding',
  'startup tools': 'infra',
  hr: 'writing-docs',
};

function escapeRegExp(value: string): string {
  return value.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
}

/** Short needles must hit as tokens; longer phrases may be substrings. */
function matchesNeedle(haystack: string, needle: string): boolean {
  if (needle.length >= 5) return haystack.includes(needle);
  const re = new RegExp(`(?:^|[^a-z0-9])${escapeRegExp(needle)}(?:[^a-z0-9]|$)`);
  return re.test(haystack);
}

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

function laneFromCategories(tool: Tool): OpenSourceLaneId | null {
  for (const category of tool.categories || []) {
    const key = String(category.name || category.slug || '')
      .trim()
      .toLowerCase();
    if (key && CATEGORY_LANE[key]) return CATEGORY_LANE[key];
  }
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
      if (matchesNeedle(haystack, needle)) {
        // Longer phrases are more specific ("stable diffusion" > "audio").
        score += Math.max(1, Math.min(4, Math.ceil(needle.length / 6)));
      }
    }
    if (score > 0 && (!best || score > best.score)) {
      best = { id, score };
    }
  }

  // Weak keyword hits lose to an explicit CMS category.
  if (!best || best.score < 3) {
    const fromCategory = laneFromCategories(tool);
    if (fromCategory) return LANE_BY_ID[fromCategory];
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
