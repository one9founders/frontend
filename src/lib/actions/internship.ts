'use server';

import { cookies } from 'next/headers';

const API_URL = process.env.NEXT_PUBLIC_API_URL;

export async function submitApplication(data: {
  name: string;
  email: string;
  college: string;
  year: string;
  phone: string;
  linkedin?: string;
  track: string;
  motivation: string;
  answers: Record<string, string>;
}) {
  const cookieStore = await cookies();
  const token = cookieStore.get('access_token')?.value;

  const response = await fetch(`${API_URL}/internship/applications/`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      ...(token && { Authorization: `Bearer ${token}` }),
    },
    body: JSON.stringify(data),
  });

  if (!response.ok) {
    const error = await response.json();
    throw new Error(error.error || 'Application submission failed');
  }

  return response.json();
}

export async function saveProgress(data: any) {
  const cookieStore = await cookies();
  const token = cookieStore.get('access_token')?.value;

  const response = await fetch(`${API_URL}/internship/progress/`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      ...(token && { Authorization: `Bearer ${token}` }),
    },
    body: JSON.stringify(data),
  });

  if (!response.ok) return null;
  return response.json();
}
