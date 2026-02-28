'use client';

import { useState } from 'react';
import type { CourseModule } from '@/types/education';

interface CurriculumAccordionProps {
  modules: CourseModule[];
}

export default function CurriculumAccordion({ modules }: CurriculumAccordionProps) {
  const [openIndex, setOpenIndex] = useState<number | null>(0);

  if (!modules || modules.length === 0) return null;

  return (
    <div className="space-y-3">
      {modules.map((module, index) => (
        <div
          key={module.id}
          className="rounded-lg border border-[var(--gray-700)] bg-[var(--gray-900)] overflow-hidden"
        >
          <button
            onClick={() => setOpenIndex(openIndex === index ? null : index)}
            className="w-full flex items-center justify-between p-4 text-left hover:bg-[var(--gray-800)] transition-colors"
          >
            <div className="flex items-center gap-3">
              <span className="flex-shrink-0 w-8 h-8 rounded-full bg-purple-500/10 border border-purple-500/20 flex items-center justify-center text-sm font-medium text-purple-400">
                {index + 1}
              </span>
              <div>
                <h4 className="font-medium text-white">{module.title}</h4>
                {module.duration_description && (
                  <span className="text-xs text-[var(--gray-500)]">{module.duration_description}</span>
                )}
              </div>
            </div>
            <svg
              className={`w-5 h-5 text-[var(--gray-500)] transition-transform ${openIndex === index ? 'rotate-180' : ''}`}
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
            </svg>
          </button>
          {openIndex === index && module.description && (
            <div className="px-4 pb-4 pt-0">
              <div className="pl-11">
                <p className="text-sm text-[var(--gray-400)] leading-relaxed">{module.description}</p>
              </div>
            </div>
          )}
        </div>
      ))}
    </div>
  );
}
