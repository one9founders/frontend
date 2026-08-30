'use client';

import { useState, useEffect } from 'react';
import Navbar from '../../../components/layout/Navbar';
import Footer from '../../../components/layout/Footer';
import NewsCard from '../../../components/features/news/NewsCard';
import { newsAPI } from '../../../lib/api/apiClient';
import { News } from '../../../types';

const categories = ['All', 'AI Tools', 'AI Models', 'AI News', 'Productivity', 'Development'];

function getOrCreateSessionId(): string {
  if (typeof window === 'undefined') return '';
  
  let sessionId = localStorage.getItem('news_session_id');
  if (!sessionId) {
    sessionId = `session_${Date.now()}_${Math.random().toString(36).substring(2, 15)}`;
    localStorage.setItem('news_session_id', sessionId);
  }
  return sessionId;
}

export default function NewsPageClient() {
  const [selectedCategory, setSelectedCategory] = useState('All');
  const [news, setNews] = useState<News[]>([]);
  const [loading, setLoading] = useState(true);
  const [sessionId, setSessionId] = useState('');

  useEffect(() => {
    setSessionId(getOrCreateSessionId());
  }, []);

  useEffect(() => {
    async function fetchNews() {
      setLoading(true);
      try {
        const data = await newsAPI.getAll();
        let articles = Array.isArray(data) ? data : (data?.results || []);
        
        if (selectedCategory !== 'All') {
          articles = articles.filter((article: News) => article.category === selectedCategory);
        }
        
        setNews(articles);
      } catch (error) {
        console.error('Error fetching news:', error);
        setNews([]);
      } finally {
        setLoading(false);
      }
    }
    fetchNews();
  }, [selectedCategory]);

  return (
    <div className="min-h-screen bg-[var(--gray-black)]">
      <Navbar />
      
      <div className="max-w-7xl mx-auto px-6 py-12">
        <div className="text-center mb-12">
          <h1 className="text-4xl font-bold text-white mb-4">News & Insights</h1>
          <p className="text-[var(--gray-400)] text-lg max-w-2xl mx-auto">
            Stay updated with the latest AI tools, tips, and industry insights for founders and entrepreneurs.
          </p>
        </div>

        <div className="flex flex-wrap justify-center gap-3 mb-12">
          {categories.map((category) => (
            <button
              key={category}
              onClick={() => setSelectedCategory(category)}
              className={`px-4 py-2 rounded-full text-sm font-medium transition-colors cursor-pointer ${
                selectedCategory === category
                  ? 'text-[var(--ink)]'
                  : 'bg-[var(--gray-800)] text-[var(--gray-300)] hover:bg-[var(--gray-700)]'
              }`}
              style={selectedCategory === category ? { backgroundColor: 'var(--brand-primary)' } : {}}
            >
              {category}
            </button>
          ))}
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {loading ? (
            <div className="col-span-full text-center text-[var(--gray-400)]">Loading...</div>
          ) : news.length === 0 ? (
            <div className="col-span-full text-center py-8">
              <div className="max-w-md mx-auto bg-[var(--gray-900)] border border-[var(--gray-700)] rounded-xl p-8">
                <span className="text-4xl mb-4 block">📰</span>
                <h3 className="text-xl font-bold text-white mb-2">AI News is Coming</h3>
                <p className="text-[var(--gray-400)] mb-4">
                  We&apos;re curating the most relevant AI news for startup founders. Get notified when we launch.
                </p>
                <p className="text-xs text-[var(--gray-500)]">Subscribe via our newsletter in the footer below.</p>
              </div>
            </div>
          ) : (
            news.map((article) => (
              <NewsCard 
                key={article.id} 
                article={{
                  ...article,
                  description: article.excerpt,
                  date: article.published_at,
                  readTime: `${article.reading_time} min read`,
                  image: article.featured_image || '',
                }}
                sessionId={sessionId}
              />
            ))
          )}
        </div>

        {news.length > 0 && (
          <div className="text-center mt-12">
            <button className="bg-[var(--gray-800)] text-white px-6 py-3 rounded-lg hover:bg-[var(--gray-700)] transition-colors cursor-pointer">
              Load More Articles
            </button>
          </div>
        )}
      </div>

      <Footer />
    </div>
  );
}
