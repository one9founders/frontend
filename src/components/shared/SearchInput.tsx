'use client';

import { useState, useEffect } from 'react';
import { HugeiconsIcon, Search01Icon } from '@/components/ui/icons';

interface SearchInputProps {
  onSearch: (query: string) => void;
  onClear: () => void;
}

export default function SearchInput({ onSearch, onClear }: SearchInputProps) {
  const [query, setQuery] = useState('');

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
    }, 500);

    return () => clearTimeout(timer);
  }, [query]); // Remove onSearch and onClear from dependencies

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
          className="w-full px-6 py-4 text-lg rounded-lg focus:outline-none focus:border-purple-500 transition-colors bg-[var(--gray-900)] border border-[var(--gray-700)] text-white"
        />
        <HugeiconsIcon icon={Search01Icon} aria-hidden="true" className="absolute right-4 top-1/2 transform -translate-y-1/2 h-6 w-6 text-[var(--gray-500)]" />
      </div>
    </div>
  );
}
