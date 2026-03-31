'use client';

import { useState } from 'react';
import Link from 'next/link';
import { AgentDetail } from '@/types/agent';
import ToolLogo from '@/components/shared/ToolLogo';
import AgentMetrics from './AgentMetrics';
import SimilarAgents from './SimilarAgents';
import {
  HugeiconsIcon,
  StarIcon,
  ArrowUpRight01Icon,
  GithubIcon,
  NewTwitterIcon,
  Linkedin01Icon,
  DiscordIcon,
} from '@/components/ui/icons';

interface AgentDetailClientProps {
  agent: AgentDetail;
}

function getPricingColor(pricing: string): string {
  switch (pricing?.toLowerCase()) {
    case 'free':
      return 'bg-green-600/20 text-green-400 border-green-600/30';
    case 'freemium':
      return 'bg-blue-600/20 text-blue-400 border-blue-600/30';
    case 'paid':
      return 'bg-gray-600/20 text-gray-400 border-gray-600/30';
    default:
      return 'bg-gray-600/20 text-gray-400 border-gray-600/30';
  }
}

function getAccessColor(access: string): string {
  switch (access?.toLowerCase()) {
    case 'open source':
      return 'bg-green-600/20 text-green-400 border-green-600/30';
    case 'closed source':
      return 'bg-gray-600/20 text-gray-400 border-gray-600/30';
    case 'api':
      return 'bg-blue-600/20 text-blue-400 border-blue-600/30';
    default:
      return 'bg-gray-600/20 text-gray-400 border-gray-600/30';
  }
}

type TabType = 'overview' | 'features' | 'use-cases';

export default function AgentDetailClient({ agent }: AgentDetailClientProps) {
  const [activeTab, setActiveTab] = useState<TabType>('overview');

  const rating = agent.average_rating || 0;
  const stars = Array.from({ length: 5 }, (_, i) => i < Math.floor(rating));

  const socialLinks = [
    { url: agent.github_url, icon: GithubIcon, label: 'GitHub' },
    { url: agent.twitter_url, icon: NewTwitterIcon, label: 'Twitter' },
    { url: agent.linkedin_url, icon: Linkedin01Icon, label: 'LinkedIn' },
    { url: agent.discord_url, icon: DiscordIcon, label: 'Discord' },
  ].filter((link) => link.url);

  const tabs: { key: TabType; label: string }[] = [
    { key: 'overview', label: 'Overview' },
    { key: 'features', label: 'Features' },
    { key: 'use-cases', label: 'Use Cases' },
  ];

  return (
    <div className="max-w-7xl mx-auto">
      {/* Hero Section */}
      <div className="bg-[var(--gray-900)] border border-[var(--gray-800)] rounded-xl p-6 md:p-8 mb-8">
        <div className="flex flex-col md:flex-row gap-6">
          {/* Left: Logo, Name, Meta */}
          <div className="flex-1">
            <div className="flex items-start gap-4 mb-4">
              <ToolLogo logoUrl={agent.logo_url} name={agent.name} size="lg" />
              <div className="flex-1">
                <h1 className="text-2xl md:text-3xl font-bold text-white">{agent.name}</h1>
                <div className="flex flex-wrap items-center gap-2 mt-1 text-sm text-[var(--gray-400)]">
                  {agent.category_name && agent.category_slug && (
                    <Link
                      href={`/agents/category/${agent.category_slug}`}
                      className="hover:text-purple-400 transition-colors"
                    >
                      {agent.category_name}
                    </Link>
                  )}
                  {agent.category_name && agent.industry && (
                    <span className="text-[var(--gray-600)]">&middot;</span>
                  )}
                  {agent.industry && <span>{agent.industry}</span>}
                </div>

                {/* Rating */}
                {rating > 0 && (
                  <div className="flex items-center gap-2 mt-2">
                    <div className="flex">
                      {stars.map((filled, i) => (
                        <HugeiconsIcon
                          key={i}
                          icon={StarIcon}
                          size={18}
                          className={filled ? 'text-yellow-400' : 'text-[var(--gray-600)]'}
                        />
                      ))}
                    </div>
                    <span className="text-sm text-[var(--gray-400)]">
                      {rating.toFixed(1)} ({agent.review_count} {agent.review_count === 1 ? 'review' : 'reviews'})
                    </span>
                  </div>
                )}

                {/* Badges */}
                <div className="flex flex-wrap gap-2 mt-3">
                  {agent.pricing_model && (
                    <span className={`px-3 py-1 text-sm rounded-full border ${getPricingColor(agent.pricing_model)}`}>
                      {agent.pricing_model}
                    </span>
                  )}
                  {agent.access && (
                    <span className={`px-3 py-1 text-sm rounded-full border ${getAccessColor(agent.access)}`}>
                      {agent.access}
                    </span>
                  )}
                </div>
              </div>
            </div>
          </div>

          {/* Right: CTA + Social Links */}
          <div className="flex flex-col gap-3 md:items-end">
            {agent.website && (
              <a
                href={agent.website}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-2 px-6 py-3 rounded-lg font-medium transition-colors bg-purple-600 text-white hover:bg-purple-700"
              >
                <HugeiconsIcon icon={ArrowUpRight01Icon} size={18} />
                Visit Site
              </a>
            )}
            {agent.video_url && (
              <a
                href={agent.video_url}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-2 px-6 py-3 rounded-lg font-medium transition-colors bg-[var(--gray-800)] text-white border border-[var(--gray-700)] hover:bg-[var(--gray-700)]"
              >
                Watch Video
              </a>
            )}
            {socialLinks.length > 0 && (
              <div className="flex gap-2 mt-1">
                {socialLinks.map((link) => (
                  <a
                    key={link.label}
                    href={link.url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="p-2 rounded-lg bg-[var(--gray-800)] text-[var(--gray-400)] hover:text-white hover:bg-[var(--gray-700)] transition-colors"
                    title={link.label}
                  >
                    <HugeiconsIcon icon={link.icon} size={20} />
                  </a>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Content + Metrics layout */}
      <div className="flex flex-col lg:flex-row gap-6">
        {/* Main Content */}
        <div className="flex-1">
          {/* Tabs */}
          <div className="flex border-b border-[var(--gray-800)] mb-6">
            {tabs.map((tab) => (
              <button
                key={tab.key}
                onClick={() => setActiveTab(tab.key)}
                className={`px-4 py-3 text-sm font-medium transition-colors border-b-2 cursor-pointer ${
                  activeTab === tab.key
                    ? 'text-white border-purple-500'
                    : 'text-[var(--gray-400)] border-transparent hover:text-white hover:border-[var(--gray-600)]'
                }`}
              >
                {tab.label}
              </button>
            ))}
          </div>

          {/* Tab Content */}
          {activeTab === 'overview' && (
            <div>
              {agent.short_description && (
                <p className="text-lg text-[var(--gray-300)] mb-4 leading-relaxed">
                  {agent.short_description}
                </p>
              )}
              {agent.long_description && (
                <div className="text-[var(--gray-400)] leading-relaxed whitespace-pre-line">
                  {agent.long_description}
                </div>
              )}
              {!agent.short_description && !agent.long_description && (
                <p className="text-[var(--gray-500)]">No description available yet.</p>
              )}
            </div>
          )}

          {activeTab === 'features' && (
            <div>
              {agent.key_features && agent.key_features.length > 0 ? (
                <ul className="space-y-3">
                  {agent.key_features.map((feature, i) => {
                    const colonIndex = feature.indexOf(':');
                    const hasTitle = colonIndex > 0 && colonIndex < 60;
                    return (
                      <li key={i} className="flex items-start gap-3">
                        <span className="mt-1.5 w-2 h-2 rounded-full bg-purple-500 flex-shrink-0" />
                        <div>
                          {hasTitle ? (
                            <>
                              <span className="font-medium text-white">
                                {feature.substring(0, colonIndex)}:
                              </span>
                              <span className="text-[var(--gray-400)]">
                                {feature.substring(colonIndex + 1)}
                              </span>
                            </>
                          ) : (
                            <span className="text-[var(--gray-400)]">{feature}</span>
                          )}
                        </div>
                      </li>
                    );
                  })}
                </ul>
              ) : (
                <p className="text-[var(--gray-500)]">No features listed yet.</p>
              )}
            </div>
          )}

          {activeTab === 'use-cases' && (
            <div>
              {agent.use_cases && agent.use_cases.length > 0 ? (
                <ul className="space-y-3">
                  {agent.use_cases.map((useCase, i) => {
                    const colonIndex = useCase.indexOf(':');
                    const hasTitle = colonIndex > 0 && colonIndex < 60;
                    return (
                      <li key={i} className="flex items-start gap-3">
                        <span className="mt-1.5 w-2 h-2 rounded-full bg-blue-500 flex-shrink-0" />
                        <div>
                          {hasTitle ? (
                            <>
                              <span className="font-medium text-white">
                                {useCase.substring(0, colonIndex)}:
                              </span>
                              <span className="text-[var(--gray-400)]">
                                {useCase.substring(colonIndex + 1)}
                              </span>
                            </>
                          ) : (
                            <span className="text-[var(--gray-400)]">{useCase}</span>
                          )}
                        </div>
                      </li>
                    );
                  })}
                </ul>
              ) : (
                <p className="text-[var(--gray-500)]">No use cases listed yet.</p>
              )}
            </div>
          )}
        </div>

        {/* Metrics Sidebar */}
        <div className="lg:w-80 flex-shrink-0">
          <AgentMetrics agent={agent} />
        </div>
      </div>

      {/* Similar Agents */}
      <SimilarAgents categorySlug={agent.category_slug} currentSlug={agent.slug} />
    </div>
  );
}
