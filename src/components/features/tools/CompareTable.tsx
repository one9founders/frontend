'use client';

import { Tool } from '@/types';
import { HugeiconsIcon, Cancel01Icon, StarIcon, ArrowUpRight01Icon, ViewIcon, CheckmarkCircle01Icon, Cancel02Icon } from '@/components/ui/icons';
import Link from 'next/link';
import ToolLogo from '@/components/shared/ToolLogo';

interface CompareTableProps {
  tools: Tool[];
  onRemoveTool: (toolId: number) => void;
}

export default function CompareTable({ tools, onRemoveTool }: CompareTableProps) {
  const getRatingStars = (rating?: number) => {
    if (!rating) return 'N/A';
    return Array.from({ length: 5 }, (_, i) => (
      <HugeiconsIcon 
        key={i} 
        icon={StarIcon}
        size={16} 
        className={i < Math.floor(rating) ? 'text-yellow-400' : 'text-[var(--gray-600)]'}
      />
    ));
  };

  const getPricingDisplay = (tool: Tool) => {
    if (tool.free_tier_available) return { text: 'Free', color: 'text-green-400' };
    if (tool.pricing_models?.some(p => p.toLowerCase() === 'free')) return { text: 'Free', color: 'text-green-400' };
    if (tool.pricing_models?.some(p => p.toLowerCase() === 'freemium')) return { text: 'Freemium', color: 'text-cyan-400' };
    if (tool.pricing_from) return { text: `From $${tool.pricing_from}/mo`, color: 'text-purple-400' };
    if (tool.pricing_models?.length) return { text: tool.pricing_models.join(', '), color: 'text-[var(--gray-300)]' };
    return { text: 'Contact for pricing', color: 'text-[var(--gray-400)]' };
  };

  const getFeatureValue = (tool: Tool, feature: string): { available: boolean; text?: string } => {
    switch (feature) {
      case 'free_tier':
        return { available: tool.free_tier_available || tool.pricing_models?.some(p => p.toLowerCase() === 'free') || false };
      case 'free_trial':
        return { available: !!tool.free_trial_days, text: tool.free_trial_days ? `${tool.free_trial_days} days` : undefined };
      case 'api_access':
        return { available: tool.features?.some(f => f.toLowerCase().includes('api')) || false };
      case 'mobile_app':
        return { available: tool.platforms?.some(p => p.toLowerCase().includes('ios') || p.toLowerCase().includes('android')) || false };
      case 'integrations':
        return { available: (tool.integrations?.length || 0) > 0, text: tool.integrations?.length ? `${tool.integrations.length}+ integrations` : undefined };
      default:
        return { available: false };
    }
  };

  const FeatureCell = ({ available, text }: { available: boolean; text?: string }) => (
    <div className="flex items-center justify-center gap-2">
      {available ? (
        <>
          <HugeiconsIcon icon={CheckmarkCircle01Icon} size={18} className="text-green-400" />
          {text && <span className="text-green-400 text-sm">{text}</span>}
        </>
      ) : (
        <HugeiconsIcon icon={Cancel02Icon} size={18} className="text-[var(--gray-500)]" />
      )}
    </div>
  );

  // Calculate comparison highlights
  const getHighlights = () => {
    const highlights: { toolId: number; type: string; label: string }[] = [];
    
    // Best rating
    const bestRating = tools.reduce((best, tool) => 
      (tool.rating || 0) > (best?.rating || 0) ? tool : best, tools[0]);
    if (bestRating?.rating) {
      highlights.push({ toolId: bestRating.id, type: 'rating', label: 'Highest Rated' });
    }
    
    // Most affordable (has free tier)
    const freeTool = tools.find(t => t.free_tier_available || t.pricing_models?.some(p => p.toLowerCase() === 'free'));
    if (freeTool) {
      highlights.push({ toolId: freeTool.id, type: 'price', label: 'Free Option' });
    }
    
    // Most integrations
    const mostIntegrations = tools.reduce((best, tool) => 
      (tool.integrations?.length || 0) > (best?.integrations?.length || 0) ? tool : best, tools[0]);
    if (mostIntegrations?.integrations?.length) {
      highlights.push({ toolId: mostIntegrations.id, type: 'integrations', label: 'Most Integrations' });
    }

    return highlights;
  };

  const highlights = getHighlights();

  return (
    <div className="space-y-6">
      {/* Comparison Header with Quick Stats */}
      <div className="bg-gradient-to-r from-purple-900/30 to-blue-900/30 rounded-lg p-6 border border-purple-500/20">
        <h2 className="text-2xl font-bold text-white mb-4">Comparison Results</h2>
        <div className="flex flex-wrap gap-4">
          {highlights.map((highlight, index) => {
            const tool = tools.find(t => t.id === highlight.toolId);
            return (
              <div key={index} className="flex items-center gap-2 px-3 py-2 bg-[var(--gray-800)] rounded-lg">
                <ToolLogo logoUrl={tool?.logo_url} name={tool?.name || ''} size="xs" />
                <span className="text-white text-sm font-medium">{tool?.name}</span>
                <span className="px-2 py-0.5 text-xs bg-purple-600/50 text-purple-200 rounded-full">
                  {highlight.label}
                </span>
              </div>
            );
          })}
        </div>
      </div>

      {/* Main Comparison Table */}
      <div className="bg-[var(--gray-900)] rounded-lg overflow-hidden border border-[var(--gray-800)]">
        <div className="overflow-x-auto">
          <table className="w-full">
            {/* Tool Headers */}
            <thead>
              <tr className="border-b border-[var(--gray-700)] bg-[var(--gray-800)]/50">
                <th className="p-4 text-left text-[var(--gray-400)] font-semibold w-48">Compare</th>
                {tools.map((tool) => (
                  <th key={tool.id} className="p-4 text-center min-w-56">
                    <div className="relative">
                      <button
                        onClick={() => onRemoveTool(tool.id)}
                        className="absolute -top-1 -right-1 w-6 h-6 bg-red-500/80 text-white rounded-full hover:bg-red-500 flex items-center justify-center transition-colors"
                        title="Remove from comparison"
                      >
                        <HugeiconsIcon icon={Cancel01Icon} size={12} />
                      </button>
                      <div className="mx-auto mb-3 flex items-center justify-center">
                        <ToolLogo logoUrl={tool.logo_url} name={tool.name} size="lg" />
                      </div>
                      <h3 className="text-white font-bold text-lg">{tool.name}</h3>
                      <p className="text-[var(--gray-400)] text-xs mt-1">
                        {tool.categories?.slice(0, 2).map((c) => c.name).join(', ')}
                      </p>
                    </div>
                  </th>
                ))}
              </tr>
            </thead>
            
            <tbody>
              {/* Description */}
              <tr className="border-b border-[var(--gray-800)]">
                <td className="p-4 text-[var(--gray-400)] font-medium">Description</td>
                {tools.map((tool) => (
                  <td key={tool.id} className="p-4 text-[var(--gray-300)] text-sm">
                    <p className="line-clamp-3">{tool.short_description || tool.description}</p>
                  </td>
                ))}
              </tr>
              
              {/* Pricing */}
              <tr className="border-b border-[var(--gray-800)] bg-[var(--gray-800)]/30">
                <td className="p-4 text-[var(--gray-400)] font-medium">Pricing</td>
                {tools.map((tool) => {
                  const pricing = getPricingDisplay(tool);
                  return (
                    <td key={tool.id} className="p-4 text-center">
                      <span className={`font-bold text-lg ${pricing.color}`}>
                        {pricing.text}
                      </span>
                      {tool.pricing_models && tool.pricing_models.length > 1 && (
                        <div className="flex flex-wrap gap-1 justify-center mt-2">
                          {tool.pricing_models.slice(0, 3).map((model, idx) => (
                            <span key={idx} className="px-2 py-0.5 text-xs bg-[var(--gray-700)] text-[var(--gray-300)] rounded-full">
                              {model}
                            </span>
                          ))}
                        </div>
                      )}
                    </td>
                  );
                })}
              </tr>

              {/* Rating */}
              <tr className="border-b border-[var(--gray-800)]">
                <td className="p-4 text-[var(--gray-400)] font-medium">Rating</td>
                {tools.map((tool) => (
                  <td key={tool.id} className="p-4 text-center">
                    <div className="flex justify-center mb-1">
                      {getRatingStars(tool.rating)}
                    </div>
                    <span className="text-[var(--gray-300)] text-sm font-medium">
                      {tool.rating ? `${Number(tool.rating).toFixed(1)}/5` : 'N/A'}
                    </span>
                    <span className="text-[var(--gray-500)] text-xs block">
                      ({tool.review_count || 0} reviews)
                    </span>
                  </td>
                ))}
              </tr>

              {/* Free Tier */}
              <tr className="border-b border-[var(--gray-800)] bg-[var(--gray-800)]/30">
                <td className="p-4 text-[var(--gray-400)] font-medium">Free Tier</td>
                {tools.map((tool) => {
                  const feature = getFeatureValue(tool, 'free_tier');
                  return (
                    <td key={tool.id} className="p-4 text-center">
                      <FeatureCell available={feature.available} />
                    </td>
                  );
                })}
              </tr>

              {/* Free Trial */}
              <tr className="border-b border-[var(--gray-800)]">
                <td className="p-4 text-[var(--gray-400)] font-medium">Free Trial</td>
                {tools.map((tool) => {
                  const feature = getFeatureValue(tool, 'free_trial');
                  return (
                    <td key={tool.id} className="p-4 text-center">
                      <FeatureCell available={feature.available} text={feature.text} />
                    </td>
                  );
                })}
              </tr>

              {/* Platforms */}
              {tools.some(tool => tool.platforms && tool.platforms.length > 0) && (
                <tr className="border-b border-[var(--gray-800)] bg-[var(--gray-800)]/30">
                  <td className="p-4 text-[var(--gray-400)] font-medium">Platforms</td>
                  {tools.map((tool) => (
                    <td key={tool.id} className="p-4">
                      <div className="flex flex-wrap gap-1 justify-center">
                        {(tool.platforms || []).slice(0, 4).map((platform, index) => (
                          <span
                            key={index}
                            className="px-2 py-1 text-xs bg-blue-600/20 text-blue-300 rounded-full border border-blue-500/30"
                          >
                            {platform}
                          </span>
                        ))}
                        {!tool.platforms?.length && (
                          <span className="text-[var(--gray-500)] text-sm">-</span>
                        )}
                      </div>
                    </td>
                  ))}
                </tr>
              )}

              {/* Integrations */}
              {tools.some(tool => tool.integrations && tool.integrations.length > 0) && (
                <tr className="border-b border-[var(--gray-800)]">
                  <td className="p-4 text-[var(--gray-400)] font-medium">Integrations</td>
                  {tools.map((tool) => (
                    <td key={tool.id} className="p-4">
                      <div className="text-center">
                        {tool.integrations?.length ? (
                          <>
                            <span className="text-purple-400 font-semibold">{tool.integrations.length}+</span>
                            <div className="flex flex-wrap gap-1 justify-center mt-2">
                              {tool.integrations.slice(0, 3).map((integration, index) => (
                                <span
                                  key={index}
                                  className="px-2 py-0.5 text-xs bg-[var(--gray-700)] text-[var(--gray-300)] rounded-full"
                                >
                                  {integration}
                                </span>
                              ))}
                              {tool.integrations.length > 3 && (
                                <span className="px-2 py-0.5 text-xs text-[var(--gray-400)]">
                                  +{tool.integrations.length - 3} more
                                </span>
                              )}
                            </div>
                          </>
                        ) : (
                          <span className="text-[var(--gray-500)] text-sm">-</span>
                        )}
                      </div>
                    </td>
                  ))}
                </tr>
              )}

              {/* Features */}
              {tools.some(tool => tool.features && tool.features.length > 0) && (
                <tr className="border-b border-[var(--gray-800)] bg-[var(--gray-800)]/30">
                  <td className="p-4 text-[var(--gray-400)] font-medium">Key Features</td>
                  {tools.map((tool) => (
                    <td key={tool.id} className="p-4">
                      <ul className="text-[var(--gray-300)] text-sm space-y-1">
                        {(tool.features || []).slice(0, 4).map((feature, index) => (
                          <li key={index} className="flex items-start gap-2">
                            <HugeiconsIcon icon={CheckmarkCircle01Icon} size={14} className="text-green-400 mt-0.5 flex-shrink-0" />
                            <span className="line-clamp-1">{feature}</span>
                          </li>
                        ))}
                        {!tool.features?.length && (
                          <li className="text-[var(--gray-500)]">-</li>
                        )}
                      </ul>
                    </td>
                  ))}
                </tr>
              )}

              {/* Use Cases */}
              {tools.some(tool => tool.use_cases && tool.use_cases.length > 0) && (
                <tr className="border-b border-[var(--gray-800)]">
                  <td className="p-4 text-[var(--gray-400)] font-medium">Best For</td>
                  {tools.map((tool) => (
                    <td key={tool.id} className="p-4">
                      <div className="flex flex-wrap gap-1 justify-center">
                        {(tool.use_cases || tool.ideal_for || []).slice(0, 3).map((useCase, index) => (
                          <span
                            key={index}
                            className="px-2 py-1 text-xs bg-green-600/20 text-green-300 rounded-full border border-green-500/30"
                          >
                            {useCase}
                          </span>
                        ))}
                        {!tool.use_cases?.length && !tool.ideal_for?.length && (
                          <span className="text-[var(--gray-500)] text-sm">-</span>
                        )}
                      </div>
                    </td>
                  ))}
                </tr>
              )}

              {/* Tags */}
              {tools.some(tool => tool.tags && tool.tags.length > 0) && (
                <tr className="border-b border-[var(--gray-800)] bg-[var(--gray-800)]/30">
                  <td className="p-4 text-[var(--gray-400)] font-medium">Tags</td>
                  {tools.map((tool) => (
                    <td key={tool.id} className="p-4">
                      <div className="flex flex-wrap gap-1 justify-center">
                        {(tool.tags || []).slice(0, 4).map((tag, index) => (
                          <span
                            key={index}
                            className="px-2 py-1 text-xs bg-[var(--gray-700)] text-[var(--gray-300)] rounded-full"
                          >
                            {tag}
                          </span>
                        ))}
                        {!tool.tags?.length && (
                          <span className="text-[var(--gray-500)] text-sm">-</span>
                        )}
                      </div>
                    </td>
                  ))}
                </tr>
              )}

              {/* Actions */}
              <tr>
                <td className="p-4 text-[var(--gray-400)] font-medium">Actions</td>
                {tools.map((tool) => (
                  <td key={tool.id} className="p-4 text-center">
                    <div className="space-y-2">
                      <a
                        href={tool.affiliate_url || tool.website || '#'}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="w-full py-2.5 px-4 bg-purple-600 text-white rounded-lg hover:bg-purple-700 text-sm font-medium flex items-center justify-center gap-2 transition-colors"
                      >
                        <HugeiconsIcon icon={ArrowUpRight01Icon} size={16} />
                        Visit Tool
                      </a>
                      <Link
                        href={`/tool/${tool.slug}`}
                        className="w-full py-2.5 px-4 bg-[var(--gray-700)] text-white rounded-lg hover:bg-[var(--gray-600)] text-sm font-medium flex items-center justify-center gap-2 transition-colors"
                      >
                        <HugeiconsIcon icon={ViewIcon} size={16} />
                        View Details
                      </Link>
                    </div>
                  </td>
                ))}
              </tr>
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
