export interface AgentListItem {
  slug: string;
  name: string;
  category_name: string;
  category_slug: string;
  industry: string;
  access: string;
  pricing_model: string;
  short_description: string;
  logo_url: string;
  popularity_score: number;
  upvotes: number;
  views: number;
  average_rating: number;
  review_count: number;
  is_featured: boolean;
  website: string;
}

export interface AgentDetail extends AgentListItem {
  id: number;
  external_id: string;
  long_description: string;
  key_features: string[];
  use_cases: string[];
  image_url: string;
  video_url: string;
  bookmark_count: number;
  views_24h: number;
  views_7d: number;
  views_30d: number;
  upvotes_24h: number;
  upvotes_7d: number;
  upvotes_30d: number;
  github_url: string;
  twitter_url: string;
  linkedin_url: string;
  discord_url: string;
  email: string;
  is_featured: boolean;
  seo_boost: boolean;
  source: string;
  created_at: string;
  updated_at: string;
}

export interface AgentCategoryTopAgent {
  name: string;
  logo_url: string;
}

export interface AgentCategory {
  slug: string;
  label: string;
  agent_count: number;
  growth_rate: number;
  new_agents_30d: number;
  top_agents: AgentCategoryTopAgent[];
}

export interface AgentStats {
  total_agents: number;
  total_categories: number;
  free_agents: number;
  open_source_agents: number;
  featured_agents: number;
  pricing_breakdown: Record<string, number>;
  access_breakdown: Record<string, number>;
}

export interface AgentListResponse {
  count: number;
  next: string | null;
  previous: string | null;
  results: AgentListItem[];
}

export interface AgentCategoriesResponse {
  categories: AgentCategory[];
}
