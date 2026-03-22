'use client';

import Link from 'next/link';

interface BreadcrumbItem {
  name: string;
  path: string;
}

interface BreadcrumbsProps {
  items: BreadcrumbItem[];
}

export default function Breadcrumbs({ items }: BreadcrumbsProps) {
  const schemaData = {
    '@context': 'https://schema.org',
    '@type': 'BreadcrumbList',
    itemListElement: items.map((item, index) => ({
      '@type': 'ListItem',
      position: index + 1,
      name: item.name,
      item: `https://www.one9founders.com${item.path}`,
    })),
  };

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(schemaData) }}
      />
      <nav className="breadcrumbs py-3 px-6" aria-label="Breadcrumb">
        <ol className="flex items-center gap-2 text-sm max-w-7xl mx-auto">
          {items.map((item, index) => (
            <li key={item.path} className="flex items-center gap-2">
              {index > 0 && (
                <span className="text-[var(--gray-600)]">/</span>
              )}
              {index === items.length - 1 ? (
                <span className="text-[var(--gray-400)]">{item.name}</span>
              ) : (
                <Link
                  href={item.path}
                  className="text-[var(--gray-500)] hover:text-white transition-colors"
                >
                  {item.name}
                </Link>
              )}
            </li>
          ))}
        </ol>
      </nav>
    </>
  );
}
