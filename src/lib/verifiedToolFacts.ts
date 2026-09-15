import type { Tool } from '@/types';

export interface PricingTier {
  name: string;
  price: number;
  billing?: string;
  note?: string;
  source?: string;
}

const CLAUDE_PLAN_SOURCE =
  'https://support.claude.com/en/articles/11049762-choose-a-claude-plan';
const CLAUDE_PRO_SOURCE =
  'https://support.claude.com/en/articles/8325606-what-is-the-pro-plan';
const CLAUDE_MAX_SOURCE =
  'https://support.claude.com/en/articles/11049741-what-is-the-max-plan';
const CLAUDE_TEAM_SOURCE =
  'https://support.claude.com/en/articles/9266767-what-is-the-team-plan';

/** Hand-checked 8 Sep 2026 against Anthropic Help Center articles above. */
const CLAUDE_FACTS: Partial<Tool> = {
  short_description:
    "Anthropic's AI assistant for writing, coding, research, and Claude Code.",
  description:
    "Claude is Anthropic's AI assistant for chat, writing, coding, research, and document analysis. Anyone in a supported location can use the permanent Free plan at claude.ai — that is an ongoing usage-limited plan, not a time-limited Pro trial. Anthropic does not advertise a standing free trial of Pro or Max; paid plans start at Pro ($20/month or $200/year in the US), then Max 5x ($100/month) and Max 20x ($200/month). Team and Enterprise are separate organization plans. API usage is billed separately in the Claude Console and is not included in a claude.ai subscription.",
  pricing_type: 'freemium',
  pricing_models: ['freemium', 'paid'],
  pricing_from: 20,
  free_tier_available: true,
  free_trial_days: null,
  pricing_inr: 1670,
  pricing_inr_with_gst: 1971,
  pricing_tiers: [
    {
      name: 'Free',
      price: 0,
      billing: 'monthly',
      note: 'Permanent plan with limited usage; session limits reset about every 5 hours.',
      source: CLAUDE_PLAN_SOURCE,
    },
    {
      name: 'Pro',
      price: 20,
      billing: 'monthly',
      note: '$200/year. At least 5× Free usage per session. No standing Pro trial.',
      source: CLAUDE_PRO_SOURCE,
    },
    {
      name: 'Max 5x',
      price: 100,
      billing: 'monthly',
      note: '5× Pro usage per session. Monthly billing only.',
      source: CLAUDE_MAX_SOURCE,
    },
    {
      name: 'Max 20x',
      price: 200,
      billing: 'monthly',
      note: '20× Pro usage per session. Monthly billing only.',
      source: CLAUDE_MAX_SOURCE,
    },
    {
      name: 'Team Standard',
      price: 25,
      billing: 'monthly',
      note: 'Min 2 seats. $20/member/month if billed annually. API not included.',
      source: CLAUDE_TEAM_SOURCE,
    },
  ],
  startup_benefits:
    'Start on the permanent Free plan at claude.ai with no credit card and no trial expiry. Upgrade to Pro at $20/month when you need more usage, Claude Code, or priority access. Anthropic does not offer a standing discount or Pro trial on request. API tokens are a separate Console bill.',
  features: [
    'Claude Code:: Agentic coding in the terminal and IDEs on Pro and Max.',
    'Long context:: Current Claude models offer up to 1M-token context on supported SKUs.',
    'Artifacts:: Interactive docs, code, and visuals generated in chat.',
    'Projects:: Persistent files and instructions for ongoing work.',
    'Vision:: Read images, PDFs, and other documents in conversation.',
  ],
  platforms: ['web', 'desktop', 'ios', 'android'],
  integrations: ['Google Drive', 'Gmail', 'Slack', 'GitHub', 'MCP'],
  use_cases: [
    'Writing, editing, and research',
    'Software development with Claude Code',
    'Analyzing documents, spreadsheets, and images',
    'Day-to-day Q&A for founders and operators',
  ],
  ideal_for: ['founders', 'developers', 'researchers', 'bootstrapped'],
  tags: ['AI Assistant', 'Writing', 'Coding', 'Anthropic', 'Claude Code'],
  startup_friendly: true,
};

const VERIFIED_BY_SLUG: Record<string, Partial<Tool>> = {
  claude: CLAUDE_FACTS,
};

export function hasPublishedTrial(days: number | null | undefined): days is number {
  return typeof days === 'number' && Number.isFinite(days) && days > 0;
}

export interface ToolSourceLink {
  href: string;
  label: string;
  observedAt?: string;
}

export function toolSourceLinks(tool: Tool): ToolSourceLink[] {
  const seen = new Set<string>();
  const links: ToolSourceLink[] = [];
  for (const source of tool.sources ?? []) {
    const href = typeof source?.url === 'string' ? source.url.trim() : '';
    const key = href.toLowerCase().replace(/\/$/, '');
    if (!href || seen.has(key)) continue;
    seen.add(key);
    links.push({
      href,
      label: source.label || source.source_label || source.source,
      observedAt: source.observed_at,
    });
  }
  for (const tier of tool.pricing_tiers ?? []) {
    const href = typeof tier?.source === 'string' ? tier.source.trim() : '';
    const key = href.toLowerCase().replace(/\/$/, '');
    if (!href || seen.has(key)) continue;
    seen.add(key);
    links.push({ href, label: tier.name ? `${tier.name} plan` : 'Pricing source' });
  }
  return links;
}

export function applyVerifiedToolFacts<T extends { slug?: string }>(tool: T | null | undefined): T | null {
  if (!tool?.slug) return tool ?? null;
  const facts = VERIFIED_BY_SLUG[tool.slug];
  if (!facts) return tool;
  return { ...tool, ...facts };
}

export function applyVerifiedToolList<T extends { slug?: string }>(tools: T[] | null | undefined): T[] {
  if (!tools?.length) return tools ?? [];
  return tools.map((tool) => applyVerifiedToolFacts(tool) ?? tool);
}
