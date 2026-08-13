import { cookies } from 'next/headers';
import { notFound } from 'next/navigation';

const API_URL = process.env.NEXT_PUBLIC_API_URL || 'https://api.one9founders.com';

export type AdminUser = {
  id: number;
  email: string;
  name: string;
  is_staff: boolean;
};

/**
 * Require an authenticated staff session. Unauthenticated or non-staff
 * callers receive a 404 so the admin surface is not confirmed to exist.
 */
export async function requireAdminSession(): Promise<{ token: string; user: AdminUser }> {
  const cookieStore = await cookies();
  const token = cookieStore.get('access_token')?.value;
  if (!token) notFound();

  let user: AdminUser | null = null;
  try {
    const response = await fetch(`${API_URL}/auth/me/`, {
      headers: { Authorization: `Bearer ${token}` },
      cache: 'no-store',
    });
    if (response.ok) {
      user = await response.json();
    }
  } catch {
    notFound();
  }

  if (!user?.is_staff) notFound();
  return { token, user };
}
