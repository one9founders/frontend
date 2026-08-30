export interface Category {
  id: number;
  name: string;
  description?: string;
  slug: string;
  tool_count?: number;
  created_at: string;
  updated_at: string;
}

export interface CategoryStat {
  category: string;
  slug?: string;
  name?: string;
  count: number;
}

export type ToolTrack =
  | 'ai_tool'
  | 'ai_agent'
  | 'open_source'
  | 'agent_skill'
  | 'mcp_server';

export interface TrackStat {
  track: ToolTrack;
  label: string;
  count: number;
}

export interface DirectoryStats {
  total_tools: number | null;
  count: number | null;
  fully_assessed_count: number | null;
  provisionally_assessed_count: number | null;
  agent_count: number | null;
  by_category: CategoryStat[];
  by_track: TrackStat[];
}

export interface DirectoryColumn {
  id: string;
  track: ToolTrack;
  label: string;
  blurb: string;
  list_path: string;
  count: number;
  tools: Tool[];
}

export interface DirectoryColumnsResponse {
  columns: DirectoryColumn[];
  tracks: { track: ToolTrack; label: string }[];
  per_column: number;
}

export interface CriterionAssessment {
  name: string;
  score: number | null;
  evidence_url: string | null;
  reasoning: string;
  automated: boolean;
}

export interface AssessmentDetail {
  version?: number;
  method?: string;
  hands_on?: boolean;
  model?: string;
  criteria?: Record<string, CriterionAssessment>;
  unassessed?: string[];
  manual_only?: string[];
}

export interface Tool {
  id: number;
  name: string;
  slug: string;
  short_description: string;
  description: string;
  categories: Category[];
  website?: string;
  affiliate_url?: string;
  logo_url?: string;
  video_demo_url?: string;
  landing_page_screenshot?: string;
  pricing_models: string[];
  pricing_tiers?: any[];
  pricing_from?: number;
  pricing_type?: string;
  free_tier_available: boolean;
  free_trial_days?: number;
  tags: string[];
  use_cases: string[];
  integrations: string[];
  features: string[];
  platforms: string[];
  startup_benefits?: string;
  ideal_for: string[];
  rating: number;
  review_count: number;
  views_count: number;
  startup_friendly: boolean;
  verified: boolean;
  is_featured: boolean;
  is_active: boolean;
  criteria_completed?: number;
  overall_score?: number | null;
  security_criterion_score?: number | null;
  last_assessed_at?: string | null;
  /** Full editorial assessment. Missing/undefined is treated as not assessed. */
  assessed?: boolean;
  /** Editorial per-criterion scores with evidence URLs. */
  assessment_detail?: AssessmentDetail | null;
  track?: ToolTrack;
  rating_status?: 'NOT_YET_RATED' | 'PROVISIONAL' | 'RATED';
  security_status?: 'NOT_ASSESSED' | 'FLAGGED' | 'VERIFIED';
  language_review_needed?: boolean;
  alternatives?: Tool[];
  similarity?: number;
  // INR pricing fields
  pricing_inr_override?: number | null;
  pricing_has_india_plan?: boolean;
  gst_applicable?: boolean;
  pricing_inr?: number | null;
  pricing_inr_with_gst?: number | null;
  /** Whether the tool meets India-specific compliance expectations (DPDP and related). */
  indiaCompliant?: boolean;
  /** Free-text notes on DPDP Act relevance, data handling, or compliance caveats. */
  dpdpNotes?: string;
  /** India-facing price display, e.g. "₹2,499/mo" or "USD only, no INR billing". */
  inrPricing?: string;
  /** Where customer/user data is stored, e.g. "India (AWS Mumbai)" or "US only". */
  dataResidency?: string;
  /** Job-function clusters this tool is suited for, e.g. ["sales", "support"]. */
  jobClusters?: string[];
  created_at: string;
  updated_at: string;
}

export interface PricingConfig {
  exchange_rate: number;
  exchange_rate_updated: string;
  gst_rate: number;
}

export interface Review {
  id: number;
  tool: number;
  tool_name?: string;
  user_name: string;
  user_email?: string;
  rating: number;
  title?: string;
  comment: string;
  pros?: string[];
  cons?: string[];
  verified_purchase: boolean;
  helpful_count: number;
  use_case?: string;
  company_size?: string;
  created_at: string;
  updated_at: string;
}

export interface Deal {
  id: number;
  tool: number;
  tool_name?: string;
  tool_logo?: string;
  offer_title: string;
  old_price: number;
  new_price: number;
  discount_percentage: number;
  expiry_date?: string;
  claims_count: number;
  deal_url: string;
  featured_deal: boolean;
  is_active: boolean;
  created_at: string;
  updated_at: string;
}

export interface News {
  id: number;
  title: string;
  slug: string;
  excerpt: string;
  content?: string;
  featured_image?: string;
  related_tools?: Tool[];
  author: string;
  category?: string;
  tags: string[];
  reading_time: number;
  views_count: number;
  upvote_count: number;
  has_upvoted: boolean;
  is_featured: boolean;
  published_at: string;
  created_at: string;
  updated_at: string;
}

export interface ToolSubmission {
  id?: number;
  name: string;
  description: string;
  website: string;
  submitter_email: string;
  submitter_name: string;
  logo_url?: string;
  short_description?: string;
  categories?: number[];
  pricing_info?: string;
  created_at?: string;
}

// --- Learning Content Types ---

export type LearningDifficulty = 'beginner' | 'intermediate' | 'advanced';
export type LearningCategory =
  | 'ai-fundamentals'
  | 'machine-learning'
  | 'natural-language-processing'
  | 'computer-vision'
  | 'automation'
  | 'data-analytics'
  | 'marketing'
  | 'product-development'
  | 'sales'
  | 'operations'
  | 'security'
  | 'other';
export type LearningAudience =
  | 'founders'
  | 'developers'
  | 'marketers'
  | 'product-managers'
  | 'designers'
  | 'non-technical'
  | 'everyone';
export type LearningPricing = 'free' | 'paid' | 'freemium';

export interface LearningContent {
  id: number;
  title: string;
  slug: string;
  short_description: string;
  featured_image?: string;
  author: string;
  difficulty: LearningDifficulty;
  estimated_time: string;
  category: LearningCategory;
  audience: LearningAudience;
  tools_used: Tool[];
  pricing: LearningPricing;
  price_amount?: number;
  is_featured: boolean;
  last_updated?: string;
  published_at?: string;
}

export interface LearningContentDetail extends LearningContent {
  content: string;
  meta_title?: string;
  meta_description?: string;
  is_published: boolean;
  created_at: string;
  updated_at: string;
}

export type Guide = LearningContent;
export type GuideDetail = LearningContentDetail;
export type Lab = LearningContent;
export type LabDetail = LearningContentDetail;
export type Workshop = LearningContent;
export type WorkshopDetail = LearningContentDetail;

export interface FilterOption {
  value: string;
  label: string;
}

export interface LearningFilters {
  difficulty: FilterOption[];
  category: FilterOption[];
  audience: FilterOption[];
  pricing: FilterOption[];
}

export interface LearningContentFiltersState {
  difficulty: string;
  category: string;
  audience: string;
}
