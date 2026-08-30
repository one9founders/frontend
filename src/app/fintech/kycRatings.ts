/**
 * Published-evidence check catalog and API mapper for /fintech.
 * Pass and Fail must cite a URL. Unknown is valid. We do not invent results.
 */

export type CheckResult = 'pass' | 'fail' | 'unknown';

export type CheckId =
  | 'dataLocalization'
  | 'consentManagement'
  | 'modelExplainability'
  | 'securityCerts'
  | 'biasTesting'
  | 'vendorViability';

export type KycCheck = {
  id: CheckId;
  result: CheckResult;
  rationale: string;
  sourceUrl?: string;
  sourceLabel?: string;
};

export type KycVendorRating = {
  slug: string;
  name: string;
  website: string;
  websiteLabel: string;
  oneLiner: string;
  indiaRelevance: string;
  checks: KycCheck[];
};

export const CHECK_CATALOG: {
  id: CheckId;
  name: string;
  desc: string;
}[] = [
  {
    id: 'dataLocalization',
    name: 'Data Localization',
    desc: 'Is your data stored in India per RBI and DPDP requirements?',
  },
  {
    id: 'consentManagement',
    name: 'Consent Management',
    desc: 'Does the tool honor consent withdrawal as DPDP mandates?',
  },
  {
    id: 'modelExplainability',
    name: 'Model Explainability',
    desc: 'Can the vendor explain how their AI makes decisions?',
  },
  {
    id: 'securityCerts',
    name: 'Security Certs',
    desc: 'SOC 2 Type II, ISO 27001, PCI DSS — only if a page claims it.',
  },
  {
    id: 'biasTesting',
    name: 'Bias Testing',
    desc: 'Has the model been tested for discriminatory outcomes?',
  },
  {
    id: 'vendorViability',
    name: 'Vendor Viability',
    desc: 'Funding, team, MCA filings, or equivalent public proof.',
  },
];

const CHECK_ORDER = CHECK_CATALOG.map((c) => c.id);

export function sourcesForVendor(vendor: KycVendorRating): {
  url: string;
  label: string;
}[] {
  const seen = new Set<string>();
  const sources: { url: string; label: string }[] = [];
  for (const check of vendor.checks) {
    if (!check.sourceUrl || seen.has(check.sourceUrl)) continue;
    seen.add(check.sourceUrl);
    sources.push({
      url: check.sourceUrl,
      label: check.sourceLabel || check.sourceUrl,
    });
  }
  return sources;
}

export function resultLabel(result: CheckResult): string {
  if (result === 'pass') return 'Pass';
  if (result === 'fail') return 'Fail';
  return 'Unknown';
}

function asResult(value: unknown): CheckResult {
  if (value === 'pass' || value === 'fail' || value === 'unknown') return value;
  return 'unknown';
}

type ApiCriterion = {
  result?: string;
  reasoning?: string;
  evidence_url?: string | null;
  evidence_label?: string | null;
};

type ApiVendor = {
  slug?: string;
  name?: string;
  website?: string;
  website_label?: string;
  one_liner?: string;
  india_relevance?: string;
  assessment_detail?: {
    reviewed_at?: string | null;
    criteria?: Record<string, ApiCriterion>;
  };
};

export type FintechStackPayload = {
  reviewed_at?: string | null;
  count?: number;
  results?: ApiVendor[];
};

function checksFromCriteria(criteria: Record<string, ApiCriterion>): KycCheck[] {
  return CHECK_ORDER.map((id) => {
    const c = criteria[id];
    const check: KycCheck = {
      id,
      result: asResult(c?.result),
      rationale: c?.reasoning || '',
    };
    if (c?.evidence_url) {
      check.sourceUrl = c.evidence_url;
      if (c.evidence_label) check.sourceLabel = c.evidence_label;
    }
    return check;
  });
}

/** Map a live stack payload. Skip malformed rows. Never invent Pass/Fail. */
export function ratingsFromApi(payload: unknown): KycVendorRating[] {
  if (!payload || typeof payload !== 'object') return [];
  const results = (payload as FintechStackPayload).results;
  if (!Array.isArray(results) || results.length === 0) return [];

  const vendors: KycVendorRating[] = [];
  for (const row of results) {
    const criteria = row?.assessment_detail?.criteria;
    if (!row?.slug || !row.name || !criteria || typeof criteria !== 'object') {
      continue;
    }
    vendors.push({
      slug: row.slug,
      name: row.name,
      website: row.website || '',
      websiteLabel: row.website_label || row.website || '',
      oneLiner: row.one_liner || '',
      indiaRelevance: row.india_relevance || '',
      checks: checksFromCriteria(criteria),
    });
  }
  return vendors;
}

export function reviewedAtFromApi(payload: unknown, fallback = ''): string {
  if (payload && typeof payload === 'object' && 'reviewed_at' in payload) {
    const value = (payload as FintechStackPayload).reviewed_at;
    if (typeof value === 'string' && value) return value;
  }
  return fallback;
}
