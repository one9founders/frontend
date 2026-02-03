'use client';

import { useState } from 'react';
import { Tool } from '@/types';
import CompareTable from '@/components/features/tools/CompareTable';
import ToolSelector from '@/components/features/tools/ToolSelector';
import posthog from 'posthog-js';

interface ComparePageClientProps {
  initialTools: Tool[];
}

export default function ComparePageClient({ initialTools }: ComparePageClientProps) {
  const [selectedTools, setSelectedTools] = useState<Tool[]>([]);

  const addTool = (tool: Tool) => {
    if (selectedTools.length < 4 && !selectedTools.find(t => t.id === tool.id)) {
      const newSelectedTools = [...selectedTools, tool];
      setSelectedTools(newSelectedTools);

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
    
    if (removedTool) {
      posthog.capture('tool_removed_from_comparison', {
        tool_id: removedTool.id,
        tool_name: removedTool.name,
        remaining_tools: selectedTools.filter(t => t.id !== toolId).map(t => t.name),
      });
    }
  };

  return (
    <>
      <ToolSelector 
        tools={initialTools}
        selectedTools={selectedTools}
        onAddTool={addTool}
        loading={false}
      />

      {selectedTools.length > 0 && (
        <CompareTable 
          tools={selectedTools}
          onRemoveTool={removeTool}
        />
      )}

      {selectedTools.length === 0 && (
        <div className="text-center py-16 bg-[var(--gray-900)] rounded-lg border border-[var(--gray-800)]">
          <div className="text-6xl mb-4">&#128269;</div>
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
    </>
  );
}
