const API_URL = process.env.NEXT_PUBLIC_API_URL || 'https://api.one9founders.com';

const EXCHANGE_RATE = 83.5;

interface APIToolResponse {
  slug: string;
  pricing_from: number | null;
  free_tier_available: boolean;
  rating: number;
  overall_score: number | null;
  security_status: string | null;
  pricing_inr: number | null;
  pricing_inr_with_gst: number | null;
  pricing_inr_override: number | null;
  pricing_has_india_plan: boolean | null;
}

export interface EnrichedToolData {
  priceUSD: number | null;
  priceINR: number | null;
  freeTier: boolean;
  score: number;
  securityRating: number;
}

/**
 * Fetch a single tool by slug from the backend API.
 * Returns null if the tool is not found or the request fails.
 */
async function fetchToolBySlug(slug: string): Promise<APIToolResponse | null> {
  try {
    const response = await fetch(`${API_URL}/api/tools/${slug}/`, {
      next: { revalidate: 300 }, // 5 min cache at fetch level
    });
    if (!response.ok) return null;
    return await response.json();
  } catch {
    return null;
  }
}

/**
 * Fetch live pricing and metadata for a list of tool slugs.
 * Returns a map from slug -> enriched data.
 * Falls back gracefully: if a tool can't be fetched, it won't appear in the map.
 */
export async function fetchToolsForStack(
  slugs: string[]
): Promise<Record<string, EnrichedToolData>> {
  const results: Record<string, EnrichedToolData> = {};

  // Fetch all tools in parallel
  const fetches = slugs.map(async (slug) => {
    const data = await fetchToolBySlug(slug);
    if (!data) return;

    const priceUSD = data.pricing_from; // null means "unknown", 0 means "free"
    let priceINR: number | null;

    // Priority: override > API INR > computed from USD > null (unknown)
    if (data.pricing_inr_override != null) {
      priceINR = data.pricing_inr_override;
    } else if (data.pricing_inr != null) {
      priceINR = data.pricing_inr;
    } else if (priceUSD != null) {
      priceINR = Math.round(priceUSD * EXCHANGE_RATE);
    } else {
      priceINR = null;
    }

    results[slug] = {
      priceUSD,
      priceINR,
      freeTier: data.free_tier_available,
      score: data.overall_score != null
        ? Number((Number(data.overall_score) * 2).toFixed(1))
        : 0,
      securityRating: data.security_status === 'VERIFIED' ? 1 : 0,
    };
  });

  await Promise.all(fetches);
  return results;
}
