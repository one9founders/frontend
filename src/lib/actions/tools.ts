'use server';

import { toolsAPI, dealsAPI, newsletterAPI } from '@/lib/api/apiClient';
import { requireAdminSession } from '@/lib/auth/admin';
import { fetchDirectoryStats } from '@/lib/api/toolsStats';
import type { DirectoryStats } from '@/types';

function withAdminToken(token: string) {
  return { Authorization: `Bearer ${token}` };
}

export async function searchTools(query: string) {
  if (!query) return [];
  try {
    return await toolsAPI.search(query);
  } catch (error) {
    console.error('Search error:', error);
    return [];
  }
}

export async function addTool(toolData: any) {
  const { token } = await requireAdminSession();
  try {
    await toolsAPI.create(toolData, withAdminToken(token));
    return { success: true };
  } catch (error: any) {
    console.error('Add tool error:', error);
    const message = error?.message || 'Failed to add tool';
    if (message.includes('unique') || message.includes('already exists')) {
      return { success: false, error: { message: 'A tool with this name already exists' } };
    }
    return { success: false, error: { message } };
  }
}

export async function updateTool(slug: string, toolData: any) {
  const { token } = await requireAdminSession();
  try {
    await toolsAPI.update(slug, toolData, withAdminToken(token));
    return { success: true };
  } catch (error) {
    console.error('Update tool error:', error);
    return { success: false, error };
  }
}

export async function getAllTools(params?: { page?: number; page_size?: number; category?: string; pricing?: string; ordering?: string; track?: string }) {
  try {
    return await toolsAPI.getAll(params);
  } catch (error) {
    console.error('Get tools error:', error);
    return { results: [], count: 0 };
  }
}

export async function deleteTool(slug: string) {
  const { token } = await requireAdminSession();
  try {
    await toolsAPI.delete(slug, withAdminToken(token));
    return { success: true };
  } catch (error) {
    console.error('Delete tool error:', error);
    return { success: false, error };
  }
}

export async function bulkImportTools(tools: any[]) {
  const { token } = await requireAdminSession();
  try {
    let added = 0;
    for (const tool of tools) {
      if (!tool.name || !tool.description) continue;
      try {
        await toolsAPI.create(tool, withAdminToken(token));
        added++;
      } catch (error) {
        console.error(`Error importing ${tool.name}:`, error);
      }
    }
    return { success: true, added, total: tools.length };
  } catch (error) {
    console.error('Bulk import error:', error);
    return { success: false, error };
  }
}

export async function seedDatabase() {
  return { success: false, error: 'Use Django backend seed_data.py instead' };
}

export async function subscribeToNewsletter(email: string) {
  try {
    await newsletterAPI.subscribe(email);
    return { success: true };
  } catch (error: any) {
    console.error('Newsletter subscription error:', error);
    return { success: false, error: error.message || 'Failed to subscribe' };
  }
}

export async function getAllDeals() {
  try {
    return await dealsAPI.getAll();
  } catch (error) {
    console.error('Get deals error:', error);
    return [];
  }
}

export async function seedDeals() {
  return { success: false, error: 'Use Django backend seed_data.py instead' };
}

export async function getDirectoryStats(): Promise<DirectoryStats | null> {
  return fetchDirectoryStats();
}

export async function getToolBySlug(slug: string) {
  try {
    return await toolsAPI.getBySlug(slug);
  } catch (error) {
    console.error('Get tool by slug error:', error);
    return null;
  }
}

export async function getReviewsByToolId(toolId: number) {
  const API_URL = process.env.NEXT_PUBLIC_API_URL || 'https://api.one9founders.com';
  try {
    const response = await fetch(`${API_URL}/reviews/?tool_id=${toolId}`, {
      next: { revalidate: 300 }, // 5 minutes - faster updates for new reviews
    });
    if (!response.ok) return [];
    const data = await response.json();
    return data?.results || data || [];
  } catch (error) {
    console.error('Get reviews error:', error);
    return [];
  }
}

export async function getToolUsageCount(toolId: number) {
  const API_URL = process.env.NEXT_PUBLIC_API_URL || 'https://api.one9founders.com';
  try {
    const response = await fetch(`${API_URL}/tools/${toolId}/usage-count/`, {
      next: { revalidate: 300 }, // 5 minutes - faster updates for usage stats
    });
    if (!response.ok) return 0;
    const data = await response.json();
    return data?.usage_count || 0;
  } catch (error) {
    console.error('Get usage count error:', error);
    return 0;
  }
}

/** How many tool pages to prerender at build. Other slugs still render on demand. */
const PREBUILD_TOOL_SLUG_LIMIT = 20;

async function fetchToolSlugs(query: string): Promise<string[]> {
  const API_URL = process.env.NEXT_PUBLIC_API_URL || 'https://api.one9founders.com';
  const response = await fetch(`${API_URL}/tools/?${query}`, {
    next: { revalidate: 300 },
  });
  if (!response.ok) return [];
  const data = await response.json();
  const tools = data?.results || data || [];
  return tools
    .map((tool: { slug: string }) => tool.slug)
    .filter(Boolean)
    .slice(0, PREBUILD_TOOL_SLUG_LIMIT);
}

export async function getAllToolSlugs() {
  try {
    const featured = await fetchToolSlugs(`featured=true&page_size=${PREBUILD_TOOL_SLUG_LIMIT}`);
    if (featured.length > 0) return featured;
    return await fetchToolSlugs(`page_size=${PREBUILD_TOOL_SLUG_LIMIT}`);
  } catch (error) {
    console.error('Get all tool slugs error:', error);
    return [];
  }
}
