import { fintechAPI, type FintechStack } from '@/lib/api/apiClient';
import {
  ratingsFromApi,
  reviewedAtFromApi,
  type KycVendorRating,
} from './kycRatings';

export type LoadedStack = {
  ratings: KycVendorRating[];
  reviewedAt: string;
  failed: boolean;
};

function isPayload(data: unknown): data is Record<string, unknown> {
  return Boolean(data) && typeof data === 'object' && !Array.isArray(data);
}

async function loadStack(stack: FintechStack): Promise<LoadedStack> {
  try {
    const data = await fintechAPI.getRatings(stack);
    if (!isPayload(data)) {
      return { ratings: [], reviewedAt: '', failed: true };
    }
    return {
      ratings: ratingsFromApi(data),
      reviewedAt: reviewedAtFromApi(data),
      failed: false,
    };
  } catch {
    return { ratings: [], reviewedAt: '', failed: true };
  }
}

export function loadKycRatings(): Promise<LoadedStack> {
  return loadStack('kyc');
}

export function loadCreditRatings(): Promise<LoadedStack> {
  return loadStack('credit');
}

export function loadFraudRatings(): Promise<LoadedStack> {
  return loadStack('fraud');
}

export async function loadAllStacks(): Promise<{
  kyc: LoadedStack;
  credit: LoadedStack;
  fraud: LoadedStack;
}> {
  const [kyc, credit, fraud] = await Promise.all([
    loadKycRatings(),
    loadCreditRatings(),
    loadFraudRatings(),
  ]);
  return { kyc, credit, fraud };
}
