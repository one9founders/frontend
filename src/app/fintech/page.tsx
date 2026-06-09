import { Metadata } from 'next';
import Navbar from '@/components/layout/Navbar';
import Footer from '@/components/layout/Footer';
import FintechClient from './FintechClient';

export const metadata: Metadata = {
  title: 'Fintech AI Stack | One9Founders',
  description:
    'Independent compliance ratings for every AI tool Indian fintech startups use. Evaluated against RBI FREE-AI, DPDP Act, AML/CFT, and 30+ regulatory checks.',
  alternates: {
    canonical: 'https://one9founders.com/fintech',
  },
  openGraph: {
    type: 'website',
    url: 'https://one9founders.com/fintech',
    title: 'Fintech AI Stack | One9Founders',
    description:
      'Independent compliance ratings for every AI tool Indian fintech startups use. Evaluated against RBI FREE-AI, DPDP Act, AML/CFT, and 30+ regulatory checks.',
    images: [
      {
        url: '/og-image.png',
        width: 1200,
        height: 630,
        alt: 'One9Founders - Fintech AI Stack',
      },
    ],
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Fintech AI Stack | One9Founders',
    description:
      'Independent compliance ratings for every AI tool Indian fintech startups use. Evaluated against RBI FREE-AI, DPDP Act, AML/CFT, and 30+ regulatory checks.',
    images: ['/og-image.png'],
  },
};

export default function FintechPage() {
  return (
    <div className="min-h-screen bg-[var(--gray-black)]">
      <Navbar />
      <FintechClient />
      <Footer />
    </div>
  );
}
