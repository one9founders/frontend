'use client';

import { useState } from 'react';
import type { CourseFAQ } from '@/types/education';

interface FAQAccordionProps {
  faqs: CourseFAQ[];
}

export default function FAQAccordion({ faqs }: FAQAccordionProps) {
  const [openIndex, setOpenIndex] = useState<number | null>(null);

  if (!faqs || faqs.length === 0) return null;

  return (
    <div className="space-y-3">
      {faqs.map((faq, index) => (
        <div
          key={faq.id}
          className="rounded-lg border border-[var(--gray-700)] bg-[var(--gray-900)] overflow-hidden"
        >
          <button
            onClick={() => setOpenIndex(openIndex === index ? null : index)}
            className="w-full flex items-center justify-between p-4 text-left hover:bg-[var(--gray-800)] transition-colors"
          >
            <h4 className="font-medium text-white pr-4">{faq.question}</h4>
            <svg
              className={`w-5 h-5 text-[var(--gray-500)] flex-shrink-0 transition-transform ${openIndex === index ? 'rotate-180' : ''}`}
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
            </svg>
          </button>
          {openIndex === index && (
            <div className="px-4 pb-4 pt-0">
              <p className="text-sm text-[var(--gray-400)] leading-relaxed">{faq.answer}</p>
            </div>
          )}
        </div>
      ))}
    </div>
  );
}
