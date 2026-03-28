'use server';

import { cookies } from 'next/headers';

const API_URL = process.env.NEXT_PUBLIC_API_URL;

interface AuthResponse {
  access: string;
  refresh: string;
  user: {
    id: number;
    email: string;
    name: string;
    is_startup: boolean;
    user_role: string;
    profile_completed: boolean;
  };
}

export async function signUp(formData: FormData) {
  const email = formData.get('email') as string;
  const password = formData.get('password') as string;
  const name = formData.get('name') as string;
  const userRole = (formData.get('user_role') as string) || 'other';
  const isStartup = formData.get('is_startup') === 'true';
  const turnstileToken = formData.get('turnstileToken') as string;

  const founderFields = isStartup ? {
    startup_name:        formData.get('startup_name') as string,
    website:             formData.get('website') as string,
    startup_stage:       formData.get('startup_stage') as string,
    team_size:           formData.get('team_size') as string,
    industry:            JSON.parse((formData.get('industry') as string) || '[]'),
    challenges:          JSON.parse((formData.get('challenges') as string) || '[]'),
    ai_tasks:            JSON.parse((formData.get('ai_tasks') as string) || '[]'),
    time_lost_per_week:  formData.get('time_lost_per_week') as string,
    ai_comfort_level:    formData.get('ai_comfort_level') as string,
  } : {};

  const response = await fetch(`${API_URL}/auth/register/`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      email,
      password,
      name,
      is_startup:      isStartup,
      user_role:       userRole,
      turnstile_token: turnstileToken,
      referral_source: (formData.get('referral_source') as string) || '',
      profile_completed: true,
      ...founderFields,
    }),
  });

  if (!response.ok) {
    const error = await response.json();
    const errorMessage = error.error || 'Sign up failed';
    const isUserExists = errorMessage.toLowerCase().includes('already exists');
    return { error: errorMessage, userExists: isUserExists };
  }

  const data: AuthResponse = await response.json();
  const cookieStore = await cookies();
  cookieStore.set('access_token',  data.access,  { httpOnly: true, secure: true, sameSite: 'lax', path: '/' });
  cookieStore.set('refresh_token', data.refresh, { httpOnly: true, secure: true, sameSite: 'lax', path: '/' });
  return { user: data.user };
}

export async function login(formData: FormData) {
  const email = formData.get('email') as string;
  const password = formData.get('password') as string;
  const turnstileToken = formData.get('turnstileToken') as string;

  const response = await fetch(`${API_URL}/auth/login/`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ email, password, turnstile_token: turnstileToken }),
  });

  if (!response.ok) {
    const error = await response.json();
    return { error: error.error || 'Login failed' };
  }

  const data: AuthResponse = await response.json();
  
  const cookieStore = await cookies();
  cookieStore.set('access_token', data.access, { httpOnly: true, secure: true, sameSite: 'lax', path: '/' });
  cookieStore.set('refresh_token', data.refresh, { httpOnly: true, secure: true, sameSite: 'lax', path: '/' });

  return { user: data.user };
}

export async function googleAuth(credential: string) {
  const response = await fetch(`${API_URL}/auth/google/`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ credential }),
  });

  if (!response.ok) {
    const error = await response.json();
    return { error: error.error || 'Google authentication failed' };
  }

  const data: AuthResponse = await response.json();
  
  const cookieStore = await cookies();
  cookieStore.set('access_token', data.access, { httpOnly: true, secure: true, sameSite: 'lax', path: '/' });
  cookieStore.set('refresh_token', data.refresh, { httpOnly: true, secure: true, sameSite: 'lax', path: '/' });

  return { user: data.user };
}

export async function logout() {
  const cookieStore = await cookies();
  cookieStore.delete('access_token');
  cookieStore.delete('refresh_token');
}

export async function getCurrentUser() {
  const cookieStore = await cookies();
  const token = cookieStore.get('access_token')?.value;

  if (!token) return null;

  try {
    const response = await fetch(`${API_URL}/auth/me/`, {
      headers: { Authorization: `Bearer ${token}` },
    });

    if (!response.ok) return null;

    return response.json();
  } catch {
    return null;
  }
}

export async function completeProfile(profileData: Record<string, unknown>) {
  const cookieStore = await cookies();
  const token = cookieStore.get('access_token')?.value;
  if (!token) return { error: 'Not authenticated' };

  const response = await fetch(`${API_URL}/auth/complete-profile/`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${token}`,
    },
    body: JSON.stringify(profileData),
  });

  if (!response.ok) {
    const error = await response.json();
    return { error: error.error || 'Failed to save profile' };
  }

  return await response.json();
}
