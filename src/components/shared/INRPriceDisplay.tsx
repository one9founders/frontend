import { Tool } from '@/types';

interface INRPriceDisplayProps {
  tool: Tool;
  showGst?: boolean;
  className?: string;
}

export default function INRPriceDisplay({ tool, showGst = true, className = '' }: INRPriceDisplayProps) {
  if (tool.pricing_inr == null) return null;

  return (
    <div className={`${className}`}>
      <span className="text-white font-semibold">
        &#8377;{tool.pricing_inr.toLocaleString('en-IN')}
      </span>
      {tool.pricing_has_india_plan && (
        <span className="ml-2 bg-orange-600/20 text-orange-400 px-1.5 py-0.5 rounded text-xs">
          India pricing available
        </span>
      )}
      {showGst && tool.gst_applicable && tool.pricing_inr_with_gst != null && (
        <span className="text-[var(--gray-500)] text-xs ml-2">
          &#8377;{tool.pricing_inr_with_gst.toLocaleString('en-IN')} incl. 18% GST
        </span>
      )}
    </div>
  );
}
