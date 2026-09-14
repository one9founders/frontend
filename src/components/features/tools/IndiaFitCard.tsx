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
    <section className="tool-section">
      <p className="tool-section-label">India</p>
      <h2 className="font-display text-2xl md:text-3xl font-bold text-[var(--paper)] mb-5 leading-tight">
        India fit
      </h2>
      <div className="tool-meta-panel">
        <div className="flex flex-wrap items-center gap-2">
          {typeof tool.indiaCompliant === 'boolean' && (
            <span
              className={
                tool.indiaCompliant ? 'tool-chip tool-chip-ok' : 'tool-chip'
              }
            >
              {tool.indiaCompliant ? 'India Compliant' : 'Not India Compliant'}
            </span>
          )}
          {hasText(tool.inrPricing) && (
            <span className="tool-chip tool-chip-accent">{tool.inrPricing}</span>
          )}
          {hasText(tool.dataResidency) && (
            <span className="tool-chip">{tool.dataResidency}</span>
          )}
        </div>
        {hasText(tool.dpdpNotes) && (
          <p className="text-[var(--gray-300)] text-sm mt-4 leading-relaxed">
            {tool.dpdpNotes}
          </p>
        )}
        {tool.jobClusters && tool.jobClusters.length > 0 && (
          <div className="flex flex-wrap gap-1.5 mt-4">
            {tool.jobClusters.map((cluster) => (
              <span key={cluster} className="tool-chip">
                {clusterLabel(cluster)}
              </span>
            ))}
          </div>
        )}
      </div>
    </section>
  );
}
