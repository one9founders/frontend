export const STATS = {
  totalResources: "25,000+",
  securityValidated: "2,500+",
  llmsCompared: "177+",
  aiAgents: "1,200+",
  openSourceModels: "100+",
  ragVectorDbs: "110+",
} as const;

export function formatToolCount(count: number | null | undefined, fallback = STATS.totalResources): string {
  if (count == null || count <= 0) return fallback;
  return count.toLocaleString('en-US');
}
