'use client';

import { trackCatalogEvent } from '@/lib/catalogEvents';

interface VisitToolButtonProps {
  href: string;
  toolId: number;
  toolName: string;
  toolSlug: string;
  categories?: string[];
  isAffiliate?: boolean;
  className?: string;
  children: React.ReactNode;
}

export default function VisitToolButton({
  href,
  toolId,
  toolSlug,
  className,
  children,
}: VisitToolButtonProps) {
  const handleClick = () => {
    trackCatalogEvent({
      event_name: 'official_site_click',
      entity_type: 'tool',
      entity_id: toolId,
      entity_slug: toolSlug,
      surface: 'tool_detail',
    });
  };

  return (
    <a
      href={href}
      target="_blank"
      rel="noopener nofollow"
      className={className}
      onClick={handleClick}
    >
      {children}
    </a>
  );
}
