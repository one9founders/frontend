import { NextRequest, NextResponse } from 'next/server';
import { SITE_APEX_HOST, SITE_CANONICAL_HOST } from '@/lib/constants/site';

const API_URL = process.env.NEXT_PUBLIC_API_URL || 'https://api.one9founders.com';

function hiddenNotFound(): NextResponse {
  return new NextResponse('Not Found', {
    status: 404,
    headers: { 'content-type': 'text/plain; charset=utf-8' },
  });
}

async function isStaffSession(token: string): Promise<boolean> {
  try {
    const response = await fetch(`${API_URL}/auth/me/`, {
      headers: { Authorization: `Bearer ${token}` },
      cache: 'no-store',
      signal: AbortSignal.timeout(4000),
    });
    if (!response.ok) return false;
    const user = await response.json();
    return Boolean(user?.is_staff);
  } catch {
    return false;
  }
}

function hostnameOf(host: string | null): string {
  return (host || '').split(':')[0].toLowerCase();
}

export async function middleware(request: NextRequest) {
  if (hostnameOf(request.headers.get('host')) === SITE_APEX_HOST) {
    const destination = request.nextUrl.clone();
    destination.hostname = SITE_CANONICAL_HOST;
    destination.protocol = 'https:';
    destination.port = '';
    return NextResponse.redirect(destination, 308);
  }

  if (!request.nextUrl.pathname.startsWith('/admin')) {
    return NextResponse.next();
  }

  const token = request.cookies.get('access_token')?.value;
  if (!token) return hiddenNotFound();
  if (!(await isStaffSession(token))) return hiddenNotFound();
  return NextResponse.next();
}

export const config = {
  matcher: ['/((?!_next/static|_next/image|favicon.ico).*)'],
};
