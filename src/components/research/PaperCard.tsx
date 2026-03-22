'use client';

import Link from 'next/link';
import { Paper } from '@/types/paper';
import CategoryPill from '@/components/ui/CategoryPill';

interface PaperCardProps {
  paper: Paper;
  variant?: 'default' | 'compact' | 'detail';
}

const tagColors: Record<string, 'teal' | 'purple' | 'amber' | 'blue' | 'green' | 'red' | 'gray'> = {
  llms: 'purple',
  agents: 'teal',
  rag: 'amber',
  vision: 'blue',
  multimodal: 'green',
  rl: 'red',
};

function formatDate(dateStr: string): string {
  if (!dateStr) return '';
  const date = new Date(dateStr);
  return date.toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' });
}

function formatAuthors(authors: string[]): string {
  if (!authors || authors.length === 0) return '';
  if (authors.length <= 3) return authors.join(', ');
  return `${authors.slice(0, 3).join(', ')}, et al.`;
}

export default function PaperCard({ paper, variant = 'default' }: PaperCardProps) {
  const encodedId = encodeURIComponent(paper.arxiv_id);

  if (variant === 'compact') {
    return (
      <Link href={`/research/${encodedId}`} className="block min-w-[280px] max-w-[320px]">
        <div className="rounded-xl border border-[var(--gray-800)] bg-[var(--gray-900)] p-3 hover:border-purple-500/50 transition-all duration-300 cursor-pointer h-full">
          <div className="flex items-center justify-between mb-2">
            <span className="text-[10px] text-[var(--gray-500)]">{formatDate(paper.published_at)}</span>
            {paper.is_trending && (
              <span className="text-[10px] font-medium text-amber-400 bg-amber-600/20 px-1.5 py-0.5 rounded-full border border-amber-600/30">Trending</span>
            )}
          </div>
          <h4 className="text-sm font-semibold text-white line-clamp-2 mb-2">{paper.title}</h4>
          <p className="text-xs text-[var(--gray-500)] line-clamp-1 mb-2">{formatAuthors(paper.authors)}</p>
          <div className="flex items-center gap-2">
            {paper.ai_tags && paper.ai_tags.slice(0, 2).map((tag) => (
              <CategoryPill key={tag} label={tag} variant={tagColors[tag.toLowerCase()] || 'gray'} size="sm" />
            ))}
            {paper.hf_upvotes > 0 && (
              <span className="text-xs text-[var(--gray-400)] ml-auto flex items-center gap-0.5">
                <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 15l7-7 7 7" /></svg>
                {paper.hf_upvotes}
              </span>
            )}
          </div>
        </div>
      </Link>
    );
  }

  return (
    <Link href={`/research/${encodedId}`} className="block">
      <div className="rounded-xl border border-[var(--gray-800)] bg-[var(--gray-900)] p-5 hover:border-purple-500/50 transition-all duration-300 cursor-pointer">
        {/* Top row: date + category */}
        <div className="flex items-center justify-between mb-3">
          <span className="text-xs text-[var(--gray-500)]">{formatDate(paper.published_at)}</span>
          <div className="flex items-center gap-2">
            {paper.categories && paper.categories.length > 0 && (
              <span className="text-xs text-[var(--gray-500)] bg-[var(--gray-800)] px-2 py-0.5 rounded-full">
                {paper.categories[0]}
              </span>
            )}
          </div>
        </div>

        {/* Title */}
        <h3 className="text-base font-bold text-white mb-2 line-clamp-2">{paper.title}</h3>

        {/* Authors */}
        <p className="text-sm text-[var(--gray-500)] mb-3">{formatAuthors(paper.authors)}</p>

        {/* AI Summary */}
        {paper.ai_summary && (
          <p className="text-sm text-[var(--gray-400)] line-clamp-3 mb-3 leading-relaxed">{paper.ai_summary}</p>
        )}

        {/* Tags + upvotes + badges */}
        <div className="flex items-center justify-between gap-2 mb-3">
          <div className="flex flex-wrap gap-1.5">
            {paper.ai_tags && paper.ai_tags.slice(0, 4).map((tag) => (
              <CategoryPill key={tag} label={tag} variant={tagColors[tag.toLowerCase()] || 'gray'} size="sm" />
            ))}
          </div>
          <div className="flex items-center gap-3 flex-shrink-0">
            {paper.hf_upvotes > 0 && (
              <span className="text-sm text-[var(--gray-400)] flex items-center gap-1">
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 15l7-7 7 7" /></svg>
                {paper.hf_upvotes}
              </span>
            )}
            {paper.code_url && (
              <span className="text-xs font-medium text-green-400 bg-green-600/20 px-2 py-0.5 rounded-full border border-green-600/30">Has Code</span>
            )}
          </div>
        </div>

        {/* Quick links */}
        <div className="flex items-center gap-2">
          {paper.arxiv_url && (
            <span className="text-xs text-[var(--gray-500)] hover:text-white transition-colors bg-[var(--gray-800)] px-2 py-1 rounded">arXiv</span>
          )}
          {paper.pdf_url && (
            <span className="text-xs text-[var(--gray-500)] hover:text-white transition-colors bg-[var(--gray-800)] px-2 py-1 rounded">PDF</span>
          )}
          {paper.code_url && (
            <span className="text-xs text-[var(--gray-500)] hover:text-white transition-colors bg-[var(--gray-800)] px-2 py-1 rounded">Code</span>
          )}
          {paper.demo_url && (
            <span className="text-xs text-[var(--gray-500)] hover:text-white transition-colors bg-[var(--gray-800)] px-2 py-1 rounded">Demo</span>
          )}
        </div>
      </div>
    </Link>
  );
}
