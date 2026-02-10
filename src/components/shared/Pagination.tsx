"use client";

import { HugeiconsIcon, ArrowLeft01Icon, ArrowRight01Icon } from '@/components/ui/icons';

interface PaginationProps {
  currentPage: number;
  totalPages: number;
  onPageChange: (page: number) => void;
}

export default function Pagination({ currentPage, totalPages, onPageChange }: PaginationProps) {
  if (totalPages <= 1) return null;

  const getVisiblePages = () => {
    const pages = [];
    const maxVisible = 5;
    
    if (totalPages <= maxVisible) {
      for (let i = 1; i <= totalPages; i++) {
        pages.push(i);
      }
    } else {
      let start = Math.max(1, currentPage - 2);
      let end = Math.min(totalPages, start + maxVisible - 1);
      
      if (end - start < maxVisible - 1) {
        start = Math.max(1, end - maxVisible + 1);
      }
      
      for (let i = start; i <= end; i++) {
        pages.push(i);
      }
    }
    
    return pages;
  };

  const visiblePages = getVisiblePages();

  return (
    <div className="flex justify-center items-center flex-wrap gap-2 mt-6 md:mt-8">
      <button
        onClick={() => onPageChange(currentPage - 1)}
        disabled={currentPage === 1}
        className={`px-2 md:px-3 py-2 text-xs md:text-sm rounded-lg transition-colors flex items-center gap-1 ${
          currentPage === 1
            ? 'bg-[var(--gray-700)] text-[var(--gray-500)] cursor-not-allowed'
            : 'bg-[var(--gray-700)] text-[var(--gray-300)] hover:bg-[var(--gray-600)] hover:text-white'
        }`}
      >
        <HugeiconsIcon icon={ArrowLeft01Icon} size={16} />
        Back
      </button>
      
      {visiblePages.map((page) => (
        <button
          key={page}
          onClick={() => onPageChange(page)}
          className={`px-2 md:px-3 py-2 text-xs md:text-sm rounded-lg transition-colors ${
            currentPage === page
              ? 'bg-orange-600 text-white'
              : 'bg-[var(--gray-700)] text-[var(--gray-300)] hover:bg-[var(--gray-600)] hover:text-white'
          }`}
        >
          {page}
        </button>
      ))}
      
      <button
        onClick={() => onPageChange(currentPage + 1)}
        disabled={currentPage === totalPages}
        className={`px-2 md:px-3 py-2 text-xs md:text-sm rounded-lg transition-colors flex items-center gap-1 ${
          currentPage === totalPages
            ? 'bg-[var(--gray-700)] text-[var(--gray-500)] cursor-not-allowed'
            : 'bg-[var(--gray-700)] text-[var(--gray-300)] hover:bg-[var(--gray-600)] hover:text-white'
        }`}
      >
        Next
        <HugeiconsIcon icon={ArrowRight01Icon} size={16} />
      </button>
    </div>
  );
}
