'use client';

import { useState } from 'react';
import WorkshopCard from '@/components/features/education/WorkshopCard';
import WorkshopRegisterForm from '@/components/features/education/WorkshopRegisterForm';
import type { WorkshopListItem } from '@/types/education';

interface WorkshopsTabsClientProps {
  upcomingWorkshops: WorkshopListItem[];
  pastWorkshops: WorkshopListItem[];
}

export default function WorkshopsTabsClient({ upcomingWorkshops, pastWorkshops }: WorkshopsTabsClientProps) {
  const [activeTab, setActiveTab] = useState<'upcoming' | 'past'>('upcoming');
  const [registeringFor, setRegisteringFor] = useState<{ slug: string; title: string } | null>(null);

  return (
    <>
      {/* Tabs */}
      <div className="flex gap-1 mb-8 p-1 rounded-lg bg-[var(--gray-900)] border border-[var(--gray-700)] w-fit">
        <button
          onClick={() => setActiveTab('upcoming')}
          className={`px-4 py-2 rounded-md text-sm font-medium transition-colors ${
            activeTab === 'upcoming'
              ? 'bg-purple-500/20 text-purple-400'
              : 'text-[var(--gray-400)] hover:text-white'
          }`}
        >
          Upcoming ({upcomingWorkshops.length})
        </button>
        <button
          onClick={() => setActiveTab('past')}
          className={`px-4 py-2 rounded-md text-sm font-medium transition-colors ${
            activeTab === 'past'
              ? 'bg-purple-500/20 text-purple-400'
              : 'text-[var(--gray-400)] hover:text-white'
          }`}
        >
          Past Recordings ({pastWorkshops.length})
        </button>
      </div>

      {/* Content */}
      {activeTab === 'upcoming' && (
        <>
          {upcomingWorkshops.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {upcomingWorkshops.map((workshop) => (
                <WorkshopCard
                  key={workshop.id}
                  workshop={workshop}
                  onRegister={() => setRegisteringFor({ slug: workshop.slug, title: workshop.title })}
                />
              ))}
            </div>
          ) : (
            <div className="text-center py-20 rounded-xl border border-dashed border-[var(--gray-700)] bg-[var(--gray-900)]">
              <svg className="w-16 h-16 mx-auto mb-6 text-[var(--gray-600)]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M15 10l4.553-2.276A1 1 0 0121 8.618v6.764a1 1 0 01-1.447.894L15 14M5 18h8a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v8a2 2 0 002 2z" />
              </svg>
              <h2 className="text-2xl font-bold text-white mb-3">No Upcoming Workshops</h2>
              <p className="text-[var(--gray-400)] max-w-md mx-auto">Check back soon for new workshops.</p>
            </div>
          )}
        </>
      )}

      {activeTab === 'past' && (
        <>
          {pastWorkshops.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {pastWorkshops.map((workshop) => (
                <WorkshopCard key={workshop.id} workshop={workshop} />
              ))}
            </div>
          ) : (
            <div className="text-center py-20 rounded-xl border border-dashed border-[var(--gray-700)] bg-[var(--gray-900)]">
              <h2 className="text-2xl font-bold text-white mb-3">No Past Recordings</h2>
              <p className="text-[var(--gray-400)] max-w-md mx-auto">Recordings from completed workshops will appear here.</p>
            </div>
          )}
        </>
      )}

      {/* Registration Modal */}
      {registeringFor && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm">
          <div className="w-full max-w-md rounded-xl border border-[var(--gray-700)] bg-[var(--gray-900)] p-6 relative">
            <button
              onClick={() => setRegisteringFor(null)}
              className="absolute top-4 right-4 text-[var(--gray-500)] hover:text-white"
            >
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
            <WorkshopRegisterForm
              workshopSlug={registeringFor.slug}
              workshopTitle={registeringFor.title}
              onClose={() => setRegisteringFor(null)}
            />
          </div>
        </div>
      )}
    </>
  );
}
