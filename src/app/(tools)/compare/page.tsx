'use client';

import { useState, useEffect } from 'react';
import { getAllTools } from '@/lib/actions/tools';
import { Tool } from '@/types';
import CompareTable from '@/components/features/tools/CompareTable';
import ToolSelector from '@/components/features/tools/ToolSelector';
import Navbar from '@/components/layout/Navbar';
import Footer from '@/components/layout/Footer';
import posthog from 'posthog-js';

export default function ComparePage() {
  const [tools, setTools] = useState<Tool[]>([]);
  const [selectedTools, setSelectedTools] = useState<Tool[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadTools();
  }, []);

  const loadTools = async () => {
    // Load more tools for the compare page (100 per page instead of default 20)
    const data = await getAllTools({ page_size: 100 });
    // Handle both array and paginated response formats
    const toolsArray = Array.isArray(data) ? data : (data?.results || []);
    setTools(toolsArray);
    setLoading(false);
  };

  const addTool = (tool: Tool) => {
    if (selectedTools.length < 4 && !selectedTools.find(t => t.id === tool.id)) {
      const newSelectedTools = [...selectedTools, tool];
      setSelectedTools(newSelectedTools);

      // Capture tool comparison event
      posthog.capture('tool_comparison_started', {
        tool_id: tool.id,
        tool_name: tool.name,
        tool_slug: tool.slug,
        comparison_count: newSelectedTools.length,
        tools_in_comparison: newSelectedTools.map(t => t.name),
      });
    }
  };

  const removeTool = (toolId: number) => {
    const removedTool = selectedTools.find(t => t.id === toolId);
    setSelectedTools(selectedTools.filter(t => t.id !== toolId));
    
    // Capture tool removal event
    if (removedTool) {
      posthog.capture('tool_removed_from_comparison', {
        tool_id: removedTool.id,
        tool_name: removedTool.name,
        remaining_tools: selectedTools.filter(t => t.id !== toolId).map(t => t.name),
      });
    }
  };

  return (
    <div className="min-h-screen bg-[var(--gray-black)]">
      <Navbar />
      
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="text-center mb-10">
          <h1 className="text-4xl sm:text-5xl font-bold text-white mb-4">Compare AI Tools</h1>
          <p className="text-lg sm:text-xl text-[var(--gray-300)] max-w-2xl mx-auto">
            Select up to 4 AI tools to compare features, pricing, and ratings side by side
          </p>
        </div>

        <ToolSelector 
          tools={tools}
          selectedTools={selectedTools}
          onAddTool={addTool}
          loading={loading}
        />

        {selectedTools.length > 0 && (
          <CompareTable 
            tools={selectedTools}
            onRemoveTool={removeTool}
          />
        )}

        {selectedTools.length === 0 && !loading && (
          <div className="text-center py-16 bg-[var(--gray-900)] rounded-lg border border-[var(--gray-800)]">
            <div className="text-6xl mb-4">🔍</div>
            <h3 className="text-xl font-semibold text-white mb-2">No tools selected</h3>
            <p className="text-[var(--gray-400)]">
              Select at least 2 tools from above to start comparing
            </p>
          </div>
        )}

        {selectedTools.length === 1 && (
          <div className="text-center py-8 bg-yellow-900/20 rounded-lg border border-yellow-500/30">
            <p className="text-yellow-400">
              Select at least one more tool to see the comparison
            </p>
          </div>
        )}
      </div>
      
      <Footer />
    </div>
  );
}
