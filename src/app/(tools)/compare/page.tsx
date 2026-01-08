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
    const data = await getAllTools();
    setTools(Array.isArray(data) ? data : []);
    setLoading(false);
  };

  const addTool = (tool: Tool) => {
    if (selectedTools.length < 3 && !selectedTools.find(t => t.id === tool.id)) {
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
    setSelectedTools(selectedTools.filter(t => t.id !== toolId));
  };

  return (
    <div className="min-h-screen bg-gray-black">
      <Navbar />
      
      <div className="max-w-7xl mx-auto p-8">
        <div className="text-center mb-12">
          <h1 className="text-5xl font-bold text-white mb-4">Compare AI Tools</h1>
          <p className="text-xl text-gray-300">Compare features, pricing, and ratings side by side</p>
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
      </div>
      
      <Footer />
    </div>
  );
}