import Navbar from '@/components/layout/Navbar';
import Footer from '@/components/layout/Footer';

export default function LearnLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="min-h-screen bg-[var(--gray-black)]">
      <Navbar />
      {children}
      <Footer />
    </div>
  );
}
