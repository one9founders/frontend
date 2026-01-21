'use client';

import { useEffect, useState } from 'react';
import AuthModal from './AuthModal';

export default function AuthGuard({ children }: { children: React.ReactNode }) {
  const [isAuthenticated, setIsAuthenticated] = useState<boolean | null>(null);

  useEffect(() => {
    const checkAuth = async () => {
      try {
        const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/auth/me/`, {
          credentials: 'include',
        });
        setIsAuthenticated(res.ok);
      } catch {
        setIsAuthenticated(false);
      }
    };
    checkAuth();
  }, []);

  if (isAuthenticated === null) {
    return null;
  }

  if (!isAuthenticated) {
    return (
      <>
        <div className="fixed inset-0 bg-[var(--gray-black)] blur-sm pointer-events-none overflow-hidden">
          {children}
        </div>
        <AuthModal isOpen={true} onClose={() => {}} defaultMode="signup" />
      </>
    );
  }

  return <>{children}</>;
}
