'use client';

import Link from 'next/link';
import { useState, useEffect } from 'react';
import AuthModal from '@/components/features/auth/AuthModal';
import { getCurrentUser, logout } from '@/lib/actions/auth';

export default function Navbar() {
  const [showAuth, setShowAuth] = useState(false);
  const [user, setUser] = useState<any>(null);

  useEffect(() => {
    getCurrentUser().then(setUser);
  }, []);

  const scrollToTools = () => {
    const toolsSection = document.querySelector('#tools-section');
    if (toolsSection) {
      toolsSection.scrollIntoView({ behavior: 'smooth' });
    }
  };

  const handleSubmitTool = () => {
    window.open('/submit', '_blank');
  };

  const handleLogout = async () => {
    await logout();
    setUser(null);
    window.location.reload();
  };

  return (
    <>
      <nav className="px-6 py-4" style={{ backgroundColor: 'var(--gray-black)', borderBottom: '1px solid var(--gray-800)' }}>
        <div className="max-w-7xl mx-auto flex justify-between items-center">
          <div className="flex items-center space-x-8">
            <img src="/logo-light.png" alt="ONE9FOUNDERS" className="h-8" draggable={false} />
            <div className="flex space-x-6">
              <button onClick={scrollToTools} style={{ color: 'var(--gray-500)' }} className="hover:text-white bg-transparent border-none cursor-pointer">Explore</button>
              <Link href="/deals" style={{ color: 'var(--gray-500)' }} className="hover:text-white">Deals</Link>
              <Link href="/compare" style={{ color: 'var(--gray-500)' }} className="hover:text-white">Compare</Link>
              <Link href="/news" style={{ color: 'var(--gray-500)' }} className="hover:text-white">News</Link>
              <a href="/admin" style={{ color: 'var(--gray-500)' }} className="hover:text-white">Admin</a>
              <Link href="/about" style={{ color: 'var(--gray-500)' }} className="hover:text-white">About</Link>
            </div>
          </div>
          <div className="flex items-center space-x-4">
            <button className="btn-primary" onClick={handleSubmitTool}>
              Submit Tool
            </button>
            {user ? (
              <div className="flex items-center space-x-4">
                <span style={{ color: 'var(--gray-500)' }}>{user.name}</span>
                <button onClick={handleLogout} style={{ color: 'var(--gray-500)' }} className="hover:text-white">
                  Logout
                </button>
              </div>
            ) : (
              <button onClick={() => setShowAuth(true)} style={{ color: 'var(--gray-500)' }} className="hover:text-white">
                Login
              </button>
            )}
          </div>
        </div>
      </nav>
      <AuthModal isOpen={showAuth} onClose={() => setShowAuth(false)} />
    </>
  );
}