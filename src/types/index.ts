export interface Category {
  id: number;
  name: string;
  description?: string;
  slug: string;
  tool_count?: number;
  created_at: string;
  updated_at: string;
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
  alternatives?: Tool[];
  similarity?: number;
  created_at: string;
  updated_at: string;
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
