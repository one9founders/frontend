'use client';

import Link from 'next/link';
import { useEffect, useState } from 'react';
import { getCurrentUser } from '@/lib/actions/auth';

export default function ListingOwnerControls({ slug }: { slug: string }) {
  const [href, setHref] = useState<string | null>(null);

  useEffect(() => {
    getCurrentUser().then((user) => {
      const listings = user?.owned_listings || [];
      if (listings.some((listing: { slug: string }) => listing.slug === slug)) {
        setHref(`/tool/${slug}/edit`);
      }
    });
  }, [slug]);

  if (!href) return null;

  return (
    <Link
      href={href}
      className="inline-flex mt-3 px-4 py-2 rounded-lg text-sm font-medium bg-[var(--gray-800)] text-white hover:bg-[var(--gray-700)]"
    >
      Edit listing
    </Link>
  );
}
