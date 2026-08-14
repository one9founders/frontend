export interface LLMCapabilities {
  function_calling: boolean | null;
  structured_output: boolean | null;
  vision: boolean | null;
  web_search: boolean | null;
  code_execution: boolean | null;
  mcp: boolean | null;
  audio_input: boolean | null;
  video_input: boolean | null;
  reasoning: boolean | null;
  streaming: boolean | null;
  batch_api: boolean | null;
  computer_use: boolean | null;
}

export interface LLMSecurity {
  soc2_type2: boolean;
  gdpr_compliant: boolean;
  hipaa_eligible: boolean;
  data_residency: string[];
  data_used_for_training: string;
  enterprise_sso: boolean;
  audit_logs: boolean;
  dpdp_act_notes: string;
  security_certifications: string[];
}

export interface LLMPerformance {
  output_tokens_per_sec: number | null;
  time_to_first_token_sec: number | null;
}

export interface LLMLinks {
  try_it?: string | null;
  api_docs?: string | null;
  provider?: string | null;
  huggingface?: string | null;
  playground?: string | null;
  paper?: string | null;
}

export interface LLMModel {
  slug: string;
  name: string;
  model_family: string;
  provider: string;
  provider_slug: string;
  model_type: 'proprietary' | 'open-weights';
  is_reasoning: boolean;
  tier: 'frontier' | 'near-frontier' | 'strong' | 'capable' | 'entry-level' | 'unranked';
  parameter_count: number | null;
  parameter_display: string;
  architecture: string;
  release_date: string | null;
  country: string | null;
  license: string | null;
  context_window: number | null;
  max_output_tokens: number | null;
  input_price_per_mtok: number | null;
  output_price_per_mtok: number | null;
  cached_input_price: number | null;
  batch_input_price: number | null;
  batch_output_price: number | null;
  blended_price_per_mtok: number | null;
  price_inr_per_mtok: number | null;
  has_free_tier: boolean;
  capabilities: LLMCapabilities;
  modalities_input: string[];
  modalities_output: string[];
  aa_intelligence_index: number | null;
  arena_elo_overall: number | null;
  arena_elo_coding: number | null;
  arena_elo_math: number | null;
  arena_elo_creative: number | null;
  benchmarks: Record<string, number>;
  performance: LLMPerformance;
  value_score: number | null;
  openrouter_rank: number | null;
  hf_model_id: string | null;
  hf_downloads: number | null;
  hf_likes?: number | null;
  links: LLMLinks;
  india_budget_tier: string;
  data_completeness: number;
  data_sources: string[];
  last_updated: string;
  one9_summary: string | null;
  one9_best_for: string[];
  one9_not_great_for: string[];
  one9_verdict: string | null;
  one9_value_rating: string | null;
  startup_recommendation: string | null;
  security: LLMSecurity;
  india_availability: string | null;
  use_cases: string[];
  data_tier: 'tier1' | 'tier2' | 'tier3';
  tags: string[];
  pricing_notes?: string;
}

export interface QuickPick {
  slug: string;
  name: string;
  reason: string;
}

export interface LLMDataset {
  metadata: {
    total_models: number;
    tier1_count: number;
    tier2_count: number;
    tier3_count: number;
    last_updated: string;
    inr_rate: number;
    open_weights_count?: number;
  };
  quick_picks: Record<string, QuickPick>;
  models: LLMModel[];
}

export type LLMSortOption =
  | 'arena'
  | 'intelligence'
  | 'coding'
  | 'price-low'
  | 'price-high'
  | 'name'
  | 'downloads'
  | 'newest';

export type CurrencyMode = 'usd' | 'inr';
