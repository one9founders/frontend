/** Preferred public path for a tool row that duplicates an agent listing. */
export function toolCanonicalPath(tool: {
  slug: string;
  preferred_path?: string | null;
}): { path: string; duplicateOfAgent: boolean } {
  const own = `/tool/${tool.slug}`;
  const preferred = (tool.preferred_path || '').trim();
  if (preferred.startsWith('/agents/') && preferred !== own) {
    return { path: preferred, duplicateOfAgent: true };
  }
  return { path: own, duplicateOfAgent: false };
}

export function listingHref(tool: {
  slug: string;
  preferred_path?: string | null;
}): string {
  return toolCanonicalPath(tool).path;
}
