"use client";
import { useState, useEffect } from "react";
import { toolsAPI } from "@/lib/api/apiClient";
import { Tool } from "@/types";
import SearchInput from "./SearchInput";
import ToolCard from "../features/tools/ToolCard";
import PricingFilter from "../features/tools/PricingFilter";
import Pagination from "./Pagination";
import posthog from "posthog-js";

export default function PortfolioSection() {
  const [tools, setTools] = useState<Tool[]>([]);
  const [filteredTools, setFilteredTools] = useState<Tool[]>([]);
  const [selectedTag, setSelectedTag] = useState("All");
  const [selectedPricing, setSelectedPricing] = useState<string[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchResults, setSearchResults] = useState<Tool[]>([]);
  const [isSearching, setIsSearching] = useState(false);
  const [searchLoading, setSearchLoading] = useState(false);
  const [sortBy, setSortBy] = useState<'name' | 'rating' | 'newest' | 'match'>('name');
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [totalCount, setTotalCount] = useState(0);
  const pageSize = 20;

  const tags = ["All", "AI", "Productivity", "Design", "Development", "Content", "Video", "Writing", "Analytics", "Marketing"];

  useEffect(() => {
    loadTools();
  }, [currentPage, selectedTag, selectedPricing, sortBy]);

  useEffect(() => {
    if (isSearching) {
      setFilteredTools(searchResults);
    } else {
      setFilteredTools(tools);
    }
  }, [tools, searchResults, isSearching]);



  const loadTools = async () => {
    setLoading(true);
    try {
      const params: any = {
        page: currentPage,
        page_size: 20  // Force 20 items per page
      };
      
      if (selectedTag !== "All") {
        params.category = selectedTag;
      }
      
      if (selectedPricing.length > 0) {
        params.pricing = selectedPricing.join(',');
      }
      
      console.log('API params:', params); // Debug log
      const data = await toolsAPI.getAll(params);
      console.log('API response:', data); // Debug log
      
      if (data && typeof data === 'object' && 'results' in data) {
        setTools(data.results || []);
        setTotalCount(data.count || 0);
        setTotalPages(Math.ceil((data.count || 0) / 20));
      } else {
        // If no pagination, slice the results to 20
        const toolsArray = data || [];
        const startIndex = (currentPage - 1) * 20;
        const endIndex = startIndex + 20;
        setTools(toolsArray.slice(startIndex, endIndex));
        setTotalCount(toolsArray.length);
        setTotalPages(Math.ceil(toolsArray.length / 20));
      }
    } catch (error) {
      console.error('Failed to load tools:', error);
      setTools([]);
      setTotalCount(0);
      setTotalPages(1);
    }
    setLoading(false);
  };

  const handleTagChange = (tag: string) => {
    setSelectedTag(tag);
    setCurrentPage(1);
  };

  const handlePricingChange = (pricing: string[]) => {
    setSelectedPricing(pricing);
    setCurrentPage(1);
  };

  const handleSortChange = (sort: string) => {
    setSortBy(sort as any);
    setCurrentPage(1);
  };

  const handlePageChange = (page: number) => {
    setCurrentPage(page);
    const toolsSection = document.querySelector('#tools-section');
    if (toolsSection) {
      toolsSection.scrollIntoView({ behavior: 'smooth' });
    }
  };

  const handleSearch = async (query: string) => {
    if (!query.trim()) {
      setIsSearching(false);
      setSearchResults([]);
      setSearchLoading(false);
      setCurrentPage(1);
      return;
    }
    
    setIsSearching(true);
    setSearchLoading(true);
    setSortBy('match');
    setCurrentPage(1);
    try {
      const results = await toolsAPI.search(query);
      setSearchResults(results);

      // Capture search event
      posthog.capture('tool_search_performed', {
        search_query: query,
        results_count: results?.length || 0,
        selected_category: selectedTag,
        selected_pricing: selectedPricing,
      });
    } catch (error) {
      console.error('Search failed:', error);
      posthog.captureException(error);
      setSearchResults([]);
    }
    setSearchLoading(false);
  };

  const handleClearSearch = () => {
    setIsSearching(false);
    setSearchResults([]);
    setSortBy('name');
    setCurrentPage(1);
  };

  return (
    <section id="tools-section" className="py-8 md:py-16 px-4 md:px-6 bg-[var(--gray-black)]">
      <div className="max-w-7xl mx-auto">
        <h2 className="text-2xl md:text-4xl font-bold text-center mb-6 md:mb-8 text-white">AI Tools Directory</h2>
        
        <div className="mb-8 md:mb-12">
          <SearchInput onSearch={handleSearch} onClear={handleClearSearch} />
        </div>
        
        {/* Filters and Sort */}
        <div className="mb-6 md:mb-8">
          <div className="flex flex-col gap-4 md:gap-6">
            {/* Category Filter */}
            {!isSearching && (
              <div className="w-full">
                <h3 className="text-sm font-medium text-[var(--gray-300)] mb-3">Categories</h3>
                <div className="flex flex-wrap gap-2">
                  {tags.map((tag) => (
                    <button
                      key={tag}
                      className={`px-2 md:px-3 py-1 text-xs md:text-sm rounded-full transition-colors border-1 cursor-pointer ${
                        selectedTag === tag 
                             ? 'bg-[var(--gray-50)] border-[var(--gray-300)] text-[var(--gray-800)]' 
                          : 'bg-[var(--gray-800)] border-[var(--gray-700)] text-[var(--gray-300)] hover:text-gray-300 hover:bg-[var(--gray-700)] hover:border-[var(--gray-600)]'
                      }`}
                      onClick={() => handleTagChange(tag)}
                    >
                      {tag}
                    </button>
                  ))}
                </div>
              </div>
            )}
            
            {/* Pricing Filter and Sort */}
            <div className="flex flex-col md:flex-row gap-4 md:gap-6">
              <div className="flex-1">
                <PricingFilter 
                  selectedPricing={selectedPricing} 
                  onPricingChange={handlePricingChange} 
                />
              </div>
              
              <div className="flex-1 md:max-w-xs">
                <h3 className="text-sm font-medium text-[var(--gray-300)] mb-3">Sort by</h3>
                <select 
                  value={sortBy} 
                  onChange={(e) => handleSortChange(e.target.value)}
                  className="w-full px-3 py-2 rounded-lg bg-[var(--gray-700)] text-white border border-[var(--gray-600)]"
                >
                  {isSearching && <option value="match">Best Match</option>}
                  <option value="name">Name</option>
                  <option value="rating">Rating</option>
                  <option value="newest">Newest</option>
                </select>
              </div>
            </div>
          </div>
        </div>

        {/* Results Count */}
        {!loading && (
          <div className="mb-6 text-[var(--gray-400)] text-sm">
            {isSearching ? (
              `${filteredTools.length} tools found for your search`
            ) : (
              `Showing ${((currentPage - 1) * pageSize) + 1}-${Math.min(currentPage * pageSize, totalCount)} of ${totalCount} tools`
            )}
          </div>
        )}

        {(loading || searchLoading) ? (
          <div className="text-center text-white">
            {searchLoading ? "Searching..." : "Loading tools..."}
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4 md:gap-6">
            {filteredTools.map((tool) => (
              <ToolCard key={tool.id} tool={tool} />
            ))}
          </div>
        )}
        
        {!loading && filteredTools.length === 0 && (
          <div className="text-center text-[var(--gray-400)]">
            {isSearching ? "No tools found for your search." : "No tools available."}
          </div>
        )}
        
        {/* Pagination */}
        {!isSearching && !loading && totalPages > 1 && (
          <Pagination 
            currentPage={currentPage}
            totalPages={totalPages}
            onPageChange={handlePageChange}
          />
        )}
      </div>
    </section>
  );
}