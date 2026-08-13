import { Tool } from '@/types';

interface INRPriceDisplayProps {
  tool: Tool;
  showGst?: boolean;
  className?: string;
}

export default function INRPriceDisplay({ tool, showGst = true, className = '' }: INRPriceDisplayProps) {
  const base = tool.pricing_inr != null ? Number(tool.pricing_inr) : null;
  if (base == null || base <= 0) return null;

  const withGst = tool.pricing_inr_with_gst != null ? Number(tool.pricing_inr_with_gst) : null;
  const showGstLine =
    showGst &&
    tool.gst_applicable &&
    withGst != null &&
    withGst > 0 &&
    withGst !== base;

  return (
    <div className={`${className}`}>
      <span className="text-white font-semibold">
        &#8377;{base.toLocaleString('en-IN')}
      </span>
      {tool.pricing_has_india_plan && (
        <span className="ml-2 bg-orange-600/20 text-orange-400 px-1.5 py-0.5 rounded text-xs">
          India pricing available
        </span>
      )}
      {showGstLine && (
        <span className="text-[var(--gray-500)] text-xs ml-2">
          &#8377;{withGst!.toLocaleString('en-IN')} incl. 18% GST
        </span>
      )}
    </div>
  );
}
