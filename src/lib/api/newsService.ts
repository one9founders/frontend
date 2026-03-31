import { newsAPI } from './apiClient';

export interface NewsArticle {
  id: number;
  title: string;
  description: string;
  content: string;
  author: string;
  date: string;
  read_time: string;
  category: string;
  image: string;
}

function mapArticle(data: any): NewsArticle {
  return {
    ...data,
    description: data.excerpt || '',
    date: data.published_at || '',
    read_time: data.reading_time ? `${data.reading_time} min read` : '',
    image: data.featured_image || '',
  };
}

export async function getNews(category?: string) {
  const response = await newsAPI.getAll();
  const data = Array.isArray(response) ? response : (response?.results || []);
  
  let mapped = data.map(mapArticle);
  if (category && category !== 'All') {
    mapped = mapped.filter((article: NewsArticle) => article.category === category);
  }
  return mapped as NewsArticle[];
}

export async function getNewsById(id: string) {
  const data = await newsAPI.getBySlug(id);
  if (!data) return null;
  return mapArticle(data) as NewsArticle;
}