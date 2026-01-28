'use client';

import { Deal } from '@/types/deal';
import { HugeiconsIcon, Time01Icon, ChartUpIcon, StarIcon, ArrowUpRight01Icon } from '@/components/ui/icons';
import posthog from 'posthog-js';
import ToolLogo from '@/components/shared/ToolLogo';

interface DealCardProps {
  deal: Deal;
}

export default function DealCard({ deal }: DealCardProps) {
  const getDaysLeft = () => {
    const today = new Date();
    const expiry = new Date(deal.expiry_date);
    const diffTime = expiry.getTime() - today.getTime();
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    return diffDays;
  };

  const daysLeft = getDaysLeft();
  const isExpired = daysLeft <= 0;

  const handleClaimDeal = () => {
    if (!isExpired) {
      posthog.capture('deal_claimed', {
        deal_id: deal.id,
        tool_name: deal.tool_name,
        offer_tag: deal.offer_tag,
        offer_title: deal.offer_title,
        old_price: deal.old_price,
        new_price: deal.new_price,
        is_featured_deal: deal.featured_deal,
        days_until_expiry: daysLeft,
        claims_count: deal.claims_count,
      });
    }
  };

  return (
    <div 
      className={`rounded-lg overflow-hidden shadow-lg transition-all duration-300 hover:shadow-xl ${
        deal.featured_deal 
          ? 'border-2' 
          : 'bg-[var(--gray-900)] border border-[var(--gray-800)]'
      }`}
      style={deal.featured_deal ? { 
        background: 'linear-gradient(to bottom right, var(--brand-primary), var(--brand-tertiary))',
        borderColor: 'var(--brand-light)'
      } : {}}
    >
      
      {/* Header */}
      <div className="relative">
        {deal.featured_deal && (
          <div className="absolute top-4 left-4 z-10 flex items-center gap-2 bg-white/20 backdrop-blur-sm rounded-full px-3 py-1">
            <HugeiconsIcon icon={StarIcon} size={16} className="text-white" />
            <span className="text-white text-sm font-medium">Featured Deal</span>
          </div>
        )}
        
        <div className="absolute top-4 right-4 z-10">
          <span className="bg-red-500 text-white px-3 py-1 rounded-full text-sm font-bold">
            {deal.offer_tag}
          </span>
        </div>

        <div className="w-full h-48 flex items-center justify-center bg-[var(--gray-800)]">
          <ToolLogo logoUrl={deal.tool_logo} name={deal.tool_name} size="xl" />
        </div>
      </div>

      {/* Content */}
      <div className={`p-6 ${deal.featured_deal ? 'text-white' : ''}`}>
        <h3 className={`text-2xl font-bold mb-2 ${deal.featured_deal ? 'text-white' : 'text-white'}`}>
          {deal.tool_name}
        </h3>
        
        <p className={`text-sm mb-2 ${deal.featured_deal ? 'text-white' : 'text-[var(--brand-light)]'}`}>
          {deal.offer_title}
        </p>
        
        <p className={`text-sm mb-6 ${deal.featured_deal ? 'text-white/80' : 'text-[var(--gray-300)]'}`}>
          {deal.tool_short_desc}
        </p>

        {/* Pricing */}
        <div className="flex items-center gap-3 mb-6">
          {deal.old_price && (
            <span className={`text-lg line-through ${deal.featured_deal ? 'text-white/60' : 'text-[var(--gray-500)]'}`}>
              ${deal.old_price}/mo
            </span>
          )}
          {deal.new_price && (
            <span className={`text-2xl font-bold ${deal.featured_deal ? 'text-cyan-300' : 'text-cyan-400'}`}>
              ${deal.new_price}/mo
            </span>
          )}
        </div>

        {/* Footer Info */}
        <div className="flex justify-between items-center mb-6">
          <div className="flex items-center gap-2">
            <HugeiconsIcon icon={Time01Icon} size={16} className="text-orange-400" />
            <span className={`text-sm ${deal.featured_deal ? 'text-white' : 'text-[var(--gray-300)]'}`}>
              {isExpired ? 'Expired' : `Expires in ${daysLeft} days`}
            </span>
          </div>
          
          <div className="flex items-center gap-2">
            <HugeiconsIcon icon={ChartUpIcon} size={16} className="text-green-400" />
            <span className={`text-sm ${deal.featured_deal ? 'text-white' : 'text-[var(--gray-300)]'}`}>
              {deal.claims_count} claimed
            </span>
          </div>
        </div>

        {/* CTA Button */}
        <a
          href={deal.deal_url}
          target="_blank"
          rel="noopener noreferrer"
          className={`w-full py-3 px-4 rounded-lg font-semibold text-center block transition-colors flex items-center justify-center gap-2 ${
            isExpired
              ? 'bg-[var(--gray-600)] text-[var(--gray-400)] cursor-not-allowed'
              : deal.featured_deal
              ? 'bg-cyan-400 text-[var(--gray-900)] hover:bg-cyan-300'
              : 'bg-cyan-500 text-white hover:bg-cyan-600'
          }`}
          onClick={isExpired ? (e) => e.preventDefault() : handleClaimDeal}
        >
          {isExpired ? 'Deal Expired' : (
            <>
              Claim Deal
              <HugeiconsIcon icon={ArrowUpRight01Icon} size={16} />
            </>
          )}
        </a>
      </div>
    </div>
  );
}
