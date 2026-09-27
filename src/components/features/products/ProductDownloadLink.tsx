'use client';

import { trackCatalogEvent } from '@/lib/catalogEvents';

export default function ProductDownloadLink({
  href,
  className,
  children,
}: {
  href: string;
  className?: string;
  children: React.ReactNode;
}) {
  return (
    <a
      href={href}
      className={className}
      onClick={() => {
        trackCatalogEvent({
          event_name: 'product_activation',
          entity_type: 'product',
          entity_slug: 'worker',
          surface: 'worker_download',
        });
      }}
    >
      {children}
    </a>
  );
}
