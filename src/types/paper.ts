export interface Paper {
  arxiv_id: string;
  title: string;
  abstract: string;
  authors: string[];
  categories: string[];
  published_at: string;
  updated_at_arxiv: string;
  pdf_url: string;
  arxiv_url: string;
  hf_url: string;
  code_url: string;
  demo_url: string;
  hf_upvotes: number;
  citation_count: number;
  ai_summary: string;
  ai_tags: string[];
  ai_difficulty: 'beginner' | 'intermediate' | 'advanced';
  is_enriched: boolean;
  is_trending: boolean;
  created_at: string;
}

export interface PaperListResponse {
  count: number;
  next: string | null;
  previous: string | null;
  results: Paper[];
}

export interface PaperStats {
  total_papers: number;
  papers_today: number;
  papers_this_week: number;
  top_tags: { tag: string; count: number }[];
}
