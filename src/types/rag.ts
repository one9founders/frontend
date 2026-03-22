export interface GitHubSnapshot {
  stars: number;
  forks: number;
  open_issues: number;
  snapshot_date: string;
}

export interface RagTool {
  id: number;
  slug: string;
  name: string;
  logo_url: string;
  description: string;
  long_description: string;
  website_url: string;
  docs_url: string;
  github_url: string;
  github_repo: string;
  category: 'vector_db' | 'rag_framework' | 'embedding_model';
  pricing_model: 'free' | 'freemium' | 'paid' | 'open_source';
  pricing_details: Record<string, string>;
  deployment_options: string[];
  sdk_languages: string[];
  integrations: string[];
  specs: {
    index_types?: string[];
    distance_metrics?: string[];
    max_dimensions?: number;
    hybrid_search?: boolean;
  };
  security_certs: string[];
  rating_scores: Record<string, number>;
  overall_rating: number;
  featured: boolean;
  status: 'active' | 'deprecated' | 'stale';
  github_stars: number;
  github_forks: number;
  last_commit_at: string;
  latest_release: string;
  github_snapshots?: GitHubSnapshot[];
  created_at: string;
  updated_at: string;
}

export interface RagToolListResponse {
  count: number;
  next: string | null;
  previous: string | null;
  results: RagTool[];
}

export interface RagCategory {
  category: string;
  count: number;
}
