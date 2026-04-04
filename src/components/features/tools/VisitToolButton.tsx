'use client';

import { useAnalytics } from '@/hooks/useAnalytics';

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
  toolName,
  toolSlug,
  categories = [],
  isAffiliate = false,
  className,
  children,
}: VisitToolButtonProps) {
  const { trackEvent } = useAnalytics();

  const handleClick = () => {
    trackEvent('tool_visited_from_detail', {
      tool_id: toolId,
      tool_name: toolName,
      tool_slug: toolSlug,
      categories,
      is_affiliate: isAffiliate,
      source: 'tool_detail_page',
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
