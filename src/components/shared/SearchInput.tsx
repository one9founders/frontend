'use client';

import { useState, useEffect } from 'react';
import { HugeiconsIcon, Search01Icon } from '@/components/ui/icons';

interface SearchInputProps {
  onSearch: (query: string) => void;
  onClear: () => void;
  loading?: boolean;
  initialValue?: string;
}

export default function SearchInput({ onSearch, onClear, loading, initialValue }: SearchInputProps) {
  const [query, setQuery] = useState(initialValue || '');

  useEffect(() => {
    if (initialValue !== undefined && initialValue !== query) {
      setQuery(initialValue);
    }
    // Only sync when initialValue changes from parent
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [initialValue]);

  useEffect(() => {
    const timer = setTimeout(() => {
      try {
        if (query.trim()) {
          onSearch(query);
        } else {
          onClear();
        }
      } catch (error) {
        console.error('Error in search callback:', error);
      }
    }, 400);

    return () => clearTimeout(timer);
  }, [query, onSearch, onClear]);

  const handleClear = () => {
    setQuery('');
  };

  return (
    <div className="w-full max-w-2xl mx-auto">
      <label htmlFor="search-input" className="sr-only">
        Search AI tools
      </label>
      <div className="relative">
        <input
          id="search-input"
          type="text"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          placeholder="Search for AI tools… (e.g., 'tools for writing emails')"
          aria-label="Search AI tools"
          autoComplete="off"
          className="w-full px-6 py-4 text-lg rounded-lg focus:outline-none focus:border-purple-500 transition-colors bg-[var(--gray-900)] border border-[var(--gray-700)] text-white pr-16"
        />
        <div className="absolute right-4 top-1/2 transform -translate-y-1/2 flex items-center gap-2">
          {loading && (
            <svg className="animate-spin h-5 w-5 text-purple-400" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
              <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
              <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
            </svg>
          )}
          {query && !loading && (
            <button
              onClick={handleClear}
              className="text-[var(--gray-500)] hover:text-white transition-colors"
              aria-label="Clear search"
            >
              ✕
            </button>
          )}
          {!query && !loading && (
            <HugeiconsIcon icon={Search01Icon} aria-hidden="true" className="h-6 w-6 text-[var(--gray-500)]" />
          )}
        </div>
      </div>
    </div>
  );
}
