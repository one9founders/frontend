import Link from 'next/link';
import Navbar from '@/components/layout/Navbar';
import Footer from '@/components/layout/Footer';

export default function NotFound() {
  return (
    <div className="min-h-screen bg-[var(--gray-black)] flex flex-col">
      <Navbar />
      <main className="flex-grow flex items-center justify-center px-4 py-20 text-center">
        <div className="max-w-md w-full">
          <div className="mb-6 inline-flex items-center justify-center w-16 h-16 rounded-full bg-purple-900/20 text-purple-500">
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="w-8 h-8">
              <path strokeLinecap="round" strokeLinejoin="round" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
            </svg>
          </div>
          <h1 className="text-3xl font-bold text-white mb-2">Page Not Found</h1>
          <p className="text-[var(--gray-400)] mb-8">
            The page you're looking for doesn't exist or has been moved. Use the search to find what you need.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link
              href="/"
              className="btn-primary"
            >
              Back to Home
            </Link>
            <Link
              href="/#tools-section"
              className="btn-secondary"
            >
              Explore Tools
            </Link>
          </div>
        </div>
      </main>
      <Footer />
    </div>
  );
}
