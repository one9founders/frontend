import { Tool } from '@/types';

function hasText(value?: string): boolean {
  return typeof value === 'string' && value.trim().length > 0;
}

export function hasIndiaFitData(tool: Tool): boolean {
  return (
    typeof tool.indiaCompliant === 'boolean' ||
    hasText(tool.dpdpNotes) ||
    hasText(tool.inrPricing) ||
    hasText(tool.dataResidency) ||
    (Array.isArray(tool.jobClusters) && tool.jobClusters.length > 0)
  );
}

function clusterLabel(value: string): string {
  return value
    .split('-')
    .map((part) => part.charAt(0).toUpperCase() + part.slice(1))
    .join(' ');
}

export default function IndiaFitCard({ tool }: { tool: Tool }) {
  if (!hasIndiaFitData(tool)) return null;

  return (
    <div className="mt-8">
      <h2 className="text-xl font-semibold text-white mb-4">India Fit</h2>
      <div className="bg-[var(--gray-800)] rounded-lg p-6">
        <div className="flex flex-wrap items-center gap-2">
          {typeof tool.indiaCompliant === 'boolean' && (
            <span
              className={`px-2 py-1 rounded text-xs font-medium ${
                tool.indiaCompliant
                  ? 'bg-green-600 text-white'
                  : 'bg-[var(--gray-700)] text-[var(--gray-300)]'
              }`}
            >
              {tool.indiaCompliant ? 'India Compliant' : 'Not India Compliant'}
            </span>
          )}
          {hasText(tool.inrPricing) && (
            <span className="px-2 py-1 rounded text-xs font-medium bg-orange-600/20 text-orange-300 border border-orange-600/30">
              {tool.inrPricing}
            </span>
          )}
          {hasText(tool.dataResidency) && (
            <span className="px-2 py-1 rounded text-xs font-medium bg-blue-600/20 text-blue-300 border border-blue-600/30">
              {tool.dataResidency}
            </span>
          )}
        </div>
        {hasText(tool.dpdpNotes) && (
          <p className="text-[var(--gray-300)] text-sm mt-3 leading-relaxed">{tool.dpdpNotes}</p>
        )}
        {tool.jobClusters && tool.jobClusters.length > 0 && (
          <div className="flex flex-wrap gap-1 mt-3">
            {tool.jobClusters.map((cluster) => (
              <span
                key={cluster}
                className="bg-[var(--gray-700)] text-[var(--gray-300)] px-2 py-1 rounded-full text-xs"
              >
                {clusterLabel(cluster)}
              </span>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
