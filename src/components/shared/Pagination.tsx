"use client";

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
        className={`px-2 md:px-3 py-2 text-xs md:text-sm rounded-lg transition-colors ${
          currentPage === 1
            ? 'bg-gray-700 text-gray-500 cursor-not-allowed'
            : 'bg-gray-700 text-gray-300 hover:bg-gray-600 hover:text-white'
        }`}
      >
        Back
      </button>
      
      {visiblePages.map((page) => (
        <button
          key={page}
          onClick={() => onPageChange(page)}
          className={`px-2 md:px-3 py-2 text-xs md:text-sm rounded-lg transition-colors ${
            currentPage === page
              ? 'bg-purple-600 text-white'
              : 'bg-gray-700 text-gray-300 hover:bg-gray-600 hover:text-white'
          }`}
        >
          {page}
        </button>
      ))}
      
      <button
        onClick={() => onPageChange(currentPage + 1)}
        disabled={currentPage === totalPages}
        className={`px-2 md:px-3 py-2 text-xs md:text-sm rounded-lg transition-colors ${
          currentPage === totalPages
            ? 'bg-gray-700 text-gray-500 cursor-not-allowed'
            : 'bg-gray-700 text-gray-300 hover:bg-gray-600 hover:text-white'
        }`}
      >
        Next
      </button>
    </div>
  );
}