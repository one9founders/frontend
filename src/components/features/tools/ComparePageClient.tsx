'use client';

import { useState } from 'react';
import { Tool } from '@/types';
import CompareTable from '@/components/features/tools/CompareTable';
import ToolSelector from '@/components/features/tools/ToolSelector';
import { trackCatalogEvent } from '@/lib/catalogEvents';

interface ComparePageClientProps {
  initialTools: Tool[];
}

export default function ComparePageClient({ initialTools }: ComparePageClientProps) {
  const [selectedTools, setSelectedTools] = useState<Tool[]>([]);

  const addTool = (tool: Tool) => {
    if (selectedTools.length < 4 && !selectedTools.find(t => t.id === tool.id)) {
      const newSelectedTools = [...selectedTools, tool];
      setSelectedTools(newSelectedTools);

      trackCatalogEvent({
        event_name: 'compare_added',
        entity_type: 'tool',
        entity_id: tool.id,
        entity_slug: tool.slug,
        surface: 'compare',
        context: { results_count: newSelectedTools.length },
      });
      if (newSelectedTools.length === 2) {
        trackCatalogEvent({
          event_name: 'compare_completed',
          entity_type: 'tool',
          entity_id: tool.id,
          entity_slug: tool.slug,
          surface: 'compare',
          context: { results_count: 2 },
        });
      }
    }
  };

  const removeTool = (toolId: number) => {
    setSelectedTools(selectedTools.filter(t => t.id !== toolId));
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
