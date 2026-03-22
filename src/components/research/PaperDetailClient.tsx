'use client';

import { useState } from 'react';
import Link from 'next/link';
import { Paper } from '@/types/paper';
import CategoryPill from '@/components/ui/CategoryPill';
import PaperCard from './PaperCard';

interface PaperDetailClientProps {
  paper: Paper;
  relatedPapers: Paper[];
}

const tagColors: Record<string, 'teal' | 'purple' | 'amber' | 'blue' | 'green' | 'red' | 'gray'> = {
  llms: 'purple',
  agents: 'teal',
  rag: 'amber',
  vision: 'blue',
  multimodal: 'green',
  rl: 'red',
};

const difficultyConfig: Record<string, { label: string; variant: 'green' | 'amber' | 'red' }> = {
  beginner: { label: 'Beginner', variant: 'green' },
  intermediate: { label: 'Intermediate', variant: 'amber' },
  advanced: { label: 'Advanced', variant: 'red' },
};

function formatDate(dateStr: string): string {
  if (!dateStr) return '';
  const date = new Date(dateStr);
  return date.toLocaleDateString('en-US', { month: 'long', day: 'numeric', year: 'numeric' });
}

export default function PaperDetailClient({ paper, relatedPapers }: PaperDetailClientProps) {
  const [showAbstract, setShowAbstract] = useState(false);
  const diffConfig = difficultyConfig[paper.ai_difficulty] || { label: paper.ai_difficulty, variant: 'gray' as const };

  return (
    <div className="max-w-4xl mx-auto">
      {/* Back link */}
      <Link href="/research" className="inline-flex items-center gap-1 text-sm text-[var(--gray-400)] hover:text-white transition-colors mb-6">
        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" /></svg>
        Back to papers
      </Link>

      {/* Date + category pills */}
      <div className="flex flex-wrap items-center gap-2 mb-4">
        <span className="text-sm text-[var(--gray-500)]">{formatDate(paper.published_at)}</span>
        {paper.categories && paper.categories.map((cat) => (
          <span key={cat} className="text-xs text-[var(--gray-500)] bg-[var(--gray-800)] px-2 py-0.5 rounded-full">{cat}</span>
        ))}
        {paper.ai_difficulty && (
          <CategoryPill label={diffConfig.label} variant={diffConfig.variant} size="sm" />
        )}
      </div>

      {/* Title */}
      <h1 className="text-2xl md:text-3xl font-bold text-white mb-4 leading-tight">{paper.title}</h1>

      {/* Authors */}
      {paper.authors && paper.authors.length > 0 && (
        <div className="flex flex-wrap gap-1 mb-6">
          {paper.authors.map((author, i) => (
            <span key={i}>
              <Link
                href={`/research?search=${encodeURIComponent(author)}`}
                className="text-sm text-[var(--gray-400)] hover:text-purple-400 transition-colors"
              >
                {author}
              </Link>
              {i < paper.authors.length - 1 && <span className="text-[var(--gray-600)]">, </span>}
            </span>
          ))}
        </div>
      )}

      {/* AI Summary card */}
      {paper.ai_summary && (
        <div className="rounded-xl border border-teal-600/30 bg-teal-600/5 p-5 mb-6">
          <div className="flex items-center gap-2 mb-3">
            <svg className="w-5 h-5 text-teal-400" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" /></svg>
            <h2 className="text-sm font-semibold text-teal-400">AI-Generated Summary</h2>
          </div>
          <p className="text-[var(--gray-300)] leading-relaxed">{paper.ai_summary}</p>
        </div>
      )}

      {/* Original abstract - collapsible */}
      {paper.abstract && (
        <div className="mb-6">
          <button
            onClick={() => setShowAbstract(!showAbstract)}
            className="flex items-center gap-2 text-sm text-[var(--gray-400)] hover:text-white transition-colors cursor-pointer mb-2"
          >
            <svg className={`w-4 h-4 transition-transform ${showAbstract ? 'rotate-90' : ''}`} fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" /></svg>
            Original Abstract
          </button>
          {showAbstract && (
            <div className="rounded-xl border border-[var(--gray-800)] bg-[var(--gray-900)] p-5">
              <p className="text-sm text-[var(--gray-300)] leading-relaxed whitespace-pre-line">{paper.abstract}</p>
            </div>
          )}
        </div>
      )}

      {/* Links row */}
      <div className="flex flex-wrap gap-3 mb-8">
        {paper.arxiv_url && (
          <a href={paper.arxiv_url} target="_blank" rel="noopener noreferrer" className="px-5 py-2.5 rounded-lg font-semibold text-sm text-white btn-primary inline-flex items-center gap-2">
            Read on arXiv
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" /></svg>
          </a>
        )}
        {paper.pdf_url && (
          <a href={paper.pdf_url} target="_blank" rel="noopener noreferrer" className="px-5 py-2.5 rounded-lg font-medium text-sm text-[var(--gray-300)] border border-[var(--gray-700)] hover:border-[var(--gray-600)] transition-colors inline-flex items-center gap-2">
            Download PDF
          </a>
        )}
        {paper.code_url && (
          <a href={paper.code_url} target="_blank" rel="noopener noreferrer" className="px-5 py-2.5 rounded-lg font-medium text-sm text-[var(--gray-300)] border border-[var(--gray-700)] hover:border-[var(--gray-600)] transition-colors inline-flex items-center gap-2">
            View Code
          </a>
        )}
        {paper.demo_url && (
          <a href={paper.demo_url} target="_blank" rel="noopener noreferrer" className="px-5 py-2.5 rounded-lg font-medium text-sm text-[var(--gray-300)] border border-[var(--gray-700)] hover:border-[var(--gray-600)] transition-colors inline-flex items-center gap-2">
            Try Demo
          </a>
        )}
      </div>

      {/* Metadata card */}
      <div className="rounded-xl border border-[var(--gray-800)] bg-[var(--gray-900)] p-5 mb-8">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          {paper.hf_upvotes > 0 && (
            <div>
              <span className="text-xs text-[var(--gray-500)]">HF Upvotes</span>
              <p className="text-lg font-bold text-white flex items-center gap-1">
                <svg className="w-4 h-4 text-amber-400" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 15l7-7 7 7" /></svg>
                {paper.hf_upvotes}
              </p>
            </div>
          )}
          {paper.citation_count > 0 && (
            <div>
              <span className="text-xs text-[var(--gray-500)]">Citations</span>
              <p className="text-lg font-bold text-white">{paper.citation_count}</p>
            </div>
          )}
          {paper.ai_difficulty && (
            <div>
              <span className="text-xs text-[var(--gray-500)]">Difficulty</span>
              <div className="mt-1">
                <CategoryPill label={diffConfig.label} variant={diffConfig.variant} size="sm" />
              </div>
            </div>
          )}
          {paper.categories && paper.categories.length > 0 && (
            <div>
              <span className="text-xs text-[var(--gray-500)]">Categories</span>
              <p className="text-sm text-white mt-1">{paper.categories.join(', ')}</p>
            </div>
          )}
        </div>

        {/* AI Tags */}
        {paper.ai_tags && paper.ai_tags.length > 0 && (
          <div className="mt-4 pt-4 border-t border-[var(--gray-800)]">
            <span className="text-xs text-[var(--gray-500)] block mb-2">AI Tags</span>
            <div className="flex flex-wrap gap-2">
              {paper.ai_tags.map((tag) => (
                <CategoryPill key={tag} label={tag} variant={tagColors[tag.toLowerCase()] || 'gray'} size="sm" />
              ))}
            </div>
          </div>
        )}
      </div>

      {/* Related papers */}
      {relatedPapers.length > 0 && (
        <section>
          <h2 className="text-xl font-bold text-white mb-4">Related Papers</h2>
          <div className="space-y-4">
            {relatedPapers.slice(0, 5).map((related) => (
              <PaperCard key={related.arxiv_id} paper={related} variant="compact" />
            ))}
          </div>
        </section>
      )}
    </div>
  );
}
