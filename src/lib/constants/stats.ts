export const STATS = {
  totalResources: "25,000+",
  securityValidated: "2,500+",
  llmsCompared: "250+",
  aiAgents: "1,200+",
  openSourceModels: "140+",
  ragVectorDbs: "110+",
  researchPapers: "8,300+",
  researchAuthors: "34,000+",
} as const;

export function formatToolCount(count: number | null | undefined, fallback = STATS.totalResources): string {
  if (count == null || count <= 0) return fallback;
  return count.toLocaleString('en-US');
}

/** Floor a live catalog count to a stable marketing figure, e.g. 34424 → "34,000+". */
export function formatCatalogCount(
  count: number | null | undefined,
  fallback: string,
  step = 100,
): string {
  if (count == null || count <= 0) return fallback;
  const floored = Math.floor(count / step) * step;
  return `${floored.toLocaleString('en-US')}+`;
}
