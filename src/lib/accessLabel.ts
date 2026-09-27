type AccessFields = {
  access?: string | null;
  github_url?: string | null;
  display_access?: string | null;
};

/** Show Open Source only when a repository URL is recorded. */
export function displayAccessLabel(agent: AccessFields): string | null {
  if ('display_access' in agent) return agent.display_access || null;
  const value = (agent.access || '').trim();
  if (!value) return null;
  if (value.toLowerCase() === 'open source' && !(agent.github_url || '').trim()) return null;
  return value;
}
