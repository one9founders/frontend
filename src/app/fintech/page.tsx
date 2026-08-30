import { Metadata } from 'next';
import Navbar from '@/components/layout/Navbar';
import Footer from '@/components/layout/Footer';
import FintechClient from './FintechClient';
import { loadAllStacks } from './loadRatings';

const DESCRIPTION =
  'KYC, credit, and fraud/AML ratings for Indian fintech: named vendors, Pass / Fail / Unknown on published RBI and DPDP checks, with a source URL on every scored claim.';

export const metadata: Metadata = {
  title: 'Fintech AI Stack',
  description: DESCRIPTION,
  alternates: {
    canonical: 'https://one9founders.com/fintech',
  },
  openGraph: {
    type: 'website',
    url: 'https://one9founders.com/fintech',
    title: 'Fintech AI Stack | One9Founders',
    description: DESCRIPTION,
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
    description: DESCRIPTION,
    images: ['/og-image.png'],
  },
};

export default async function FintechPage() {
  const { kyc, credit, fraud } = await loadAllStacks();
  return (
    <div className="min-h-screen bg-[var(--gray-black)]">
      <Navbar />
      <FintechClient
        kycRatings={kyc.ratings}
        kycReviewedAt={kyc.reviewedAt}
        kycFailed={kyc.failed}
        creditRatings={credit.ratings}
        creditReviewedAt={credit.reviewedAt}
        creditFailed={credit.failed}
        fraudRatings={fraud.ratings}
        fraudReviewedAt={fraud.reviewedAt}
        fraudFailed={fraud.failed}
      />
      <Footer />
    </div>
  );
}
