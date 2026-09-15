'use server';

import { cookies } from 'next/headers';
import { revalidatePath } from 'next/cache';

import { toolsAPI } from '@/lib/api/apiClient';
import type { Tool } from '@/types';

const API_URL = process.env.NEXT_PUBLIC_API_URL || 'https://api.one9founders.com';

export type OwnedListingResult =
  | { status: 'ok'; tool: Tool }
  | { status: 'unauthenticated' }
  | { status: 'forbidden' };

function withToken(token: string) {
  return { Authorization: `Bearer ${token}` };
}

export async function getOwnedListing(slug: string): Promise<OwnedListingResult> {
  const cookieStore = await cookies();
  const token = cookieStore.get('access_token')?.value;
  if (!token) return { status: 'unauthenticated' };

  try {
    const response = await fetch(`${API_URL}/tools/${slug}/`, {
      headers: withToken(token),
      cache: 'no-store',
    });
    if (!response.ok) return { status: 'forbidden' };
    const tool = (await response.json()) as Tool;
    if (!tool?.can_edit) return { status: 'forbidden' };
    return { status: 'ok', tool };
  } catch {
    return { status: 'forbidden' };
  }
}

export async function updateOwnedListing(
  slug: string,
  toolData: Record<string, unknown>
) {
  const cookieStore = await cookies();
  const token = cookieStore.get('access_token')?.value;
  if (!token) return { success: false, error: 'Please log in to edit this listing.' };

  try {
    const updated = await toolsAPI.update(slug, toolData, withToken(token));
    revalidatePath(`/tool/${slug}`);
    revalidatePath(`/tool/${slug}/edit`);
    return { success: true, tool: updated as Tool };
  } catch (error: unknown) {
    const message = error instanceof Error ? error.message : 'Failed to update listing';
    return { success: false, error: message };
  }
}
