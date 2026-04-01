import { News } from '@/types';
import { newsAPI } from './apiClient';

export interface NewsArticle {
  id: number;
  slug: string;
  title: string;
  description: string;
  excerpt?: string;
  content?: string;
  author: string;
  date: string;
  published_at?: string;
  readTime: string;
  reading_time?: number;
  category?: string;
  image: string;
  featured_image?: string;
  upvote_count: number;
  has_upvoted: boolean;
}

function mapToNewsArticle(news: News): NewsArticle {
  return {
    id: news.id,
    slug: news.slug,
    title: news.title,
    description: news.excerpt || '',
    excerpt: news.excerpt,
    content: news.content || '',
    author: news.author,
    date: news.published_at || news.created_at,
    published_at: news.published_at,
    readTime: `${news.reading_time} min read`,
    reading_time: news.reading_time,
    category: news.category || '',
    image: news.featured_image || '',
    featured_image: news.featured_image,
    upvote_count: news.upvote_count || 0,
    has_upvoted: news.has_upvoted || false,
  };
}

export async function getNews(category?: string) {
  const data = await newsAPI.getAll();
  const articles = (Array.isArray(data) ? data : data.results || []).map(mapToNewsArticle);
  
  if (category && category !== 'All') {
    return articles.filter((article: NewsArticle) => article.category === category);
  }
  
  return articles;
}

export async function getNewsById(slug: string) {
  const data = await newsAPI.getBySlug(slug);
  return mapToNewsArticle(data);
}
