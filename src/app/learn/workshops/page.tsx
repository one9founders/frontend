import { Metadata } from 'next';
import { generateSEO, generateStructuredData } from '@/lib/utils/seo';
import Breadcrumbs from '@/components/shared/Breadcrumbs';
import { educationAPI } from '@/lib/api/apiClient';
import WorkshopCard from '@/components/features/education/WorkshopCard';
import type { WorkshopListItem, PaginatedResponse } from '@/types/education';
import WorkshopsTabsClient from './WorkshopsTabsClient';

export const revalidate = 300;

export const metadata: Metadata = generateSEO({
  title: 'AI Workshops - Live & Recorded Sessions',
  description: 'Live workshops and recorded sessions led by AI experts. Register for upcoming events or watch past recordings.',
  path: '/learn/workshops',
  keywords: ['AI workshops', 'live AI training', 'AI webinars', 'AI workshop recordings', 'IIT Bombay workshops'],
});

export default async function WorkshopsPage() {
  let upcomingWorkshops: WorkshopListItem[] = [];
  let pastWorkshops: WorkshopListItem[] = [];

  try {
    const [upcomingRes, pastRes] = await Promise.allSettled([
      educationAPI.getWorkshops({ status: 'upcoming', page_size: 20 }),
      educationAPI.getWorkshops({ status: 'completed', page_size: 20 }),
    ]);

    if (upcomingRes.status === 'fulfilled') {
      const data = upcomingRes.value as PaginatedResponse<WorkshopListItem> | WorkshopListItem[];
      upcomingWorkshops = Array.isArray(data) ? data : data?.results || [];
    }
    if (pastRes.status === 'fulfilled') {
      const data = pastRes.value as PaginatedResponse<WorkshopListItem> | WorkshopListItem[];
      pastWorkshops = Array.isArray(data) ? data : data?.results || [];
    }
  } catch {
    // Graceful fallback
  }

  const structuredData = generateStructuredData({
    '@type': 'CollectionPage',
    name: 'AI Workshops',
    description: 'Live workshops and recorded sessions led by AI experts.',
    url: 'https://www.one9founders.com/learn/workshops',
  });

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(structuredData) }}
      />
      <Breadcrumbs
        items={[
          { name: 'Home', path: '/' },
          { name: 'Learn', path: '/learn' },
          { name: 'Workshops', path: '/learn/workshops' },
        ]}
      />

      {/* Hero */}
      <section className="py-16 px-6">
        <div className="max-w-4xl mx-auto text-center">
          <h1 className="text-4xl font-bold text-white mb-4">Workshops</h1>
          <p className="text-lg text-[var(--gray-300)] max-w-2xl mx-auto">
            Live sessions with industry experts. Learn, ask questions, and network.
          </p>
        </div>
      </section>

      {/* Tabs + Content */}
      <section className="py-8 px-6">
        <div className="max-w-6xl mx-auto">
          <WorkshopsTabsClient
            upcomingWorkshops={upcomingWorkshops}
            pastWorkshops={pastWorkshops}
          />
        </div>
      </section>
    </>
  );
}
