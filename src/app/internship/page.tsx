'use client';

import Navbar from '@/components/layout/Navbar';
import Footer from '@/components/layout/Footer';
import InternshipLanding from '@/components/features/internship/InternshipLanding';
import AuthGuard from '@/components/features/auth/AuthGuard';

export default function CampusInternshipPage() {
  return (
    <AuthGuard>
      <div className="min-h-screen bg-[var(--gray-black)]">
        <Navbar />
        <InternshipLanding />
        <Footer />
      </div>
    </AuthGuard>
  );
}
