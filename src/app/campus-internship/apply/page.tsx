'use client';

import Navbar from '@/components/layout/Navbar';
import Footer from '@/components/layout/Footer';
import ApplicationForm from '@/components/features/internship/ApplicationForm';
import AuthGuard from '@/components/features/auth/AuthGuard';

export default function ApplyPage() {
  return (
    <AuthGuard>
      <div className="min-h-screen bg-[var(--gray-black)]">
        <Navbar />
        <ApplicationForm />
        <Footer />
      </div>
    </AuthGuard>
  );
}
