/**
 * Editorial rating and security status — single source of truth (frontend).
 *
 * Thresholds must stay in sync with backend `api/ratings.py`.
 * Every UI surface (cards, detail, compare, FAQ, JSON-LD) must call these
 * helpers instead of reading `tool.rating` or hardcoding "Pending".
 */

export type RatingStatus = 'NOT_YET_RATED' | 'PROVISIONAL' | 'RATED';
export type SecurityStatus = 'NOT_ASSESSED' | 'FLAGGED' | 'VERIFIED';

export const RATING_MIN_PROVISIONAL = 6;
export const RATING_FULL = 10;
export const SECURITY_VERIFIED_MIN = 12;

export type ToolRatingFields = {
  criteria_completed?: number | null;
  criteriaCompleted?: number | null;
  overall_score?: number | string | null;
  overallScore?: number | string | null;
  security_criterion_score?: number | null;
  securityCriterionScore?: number | null;
  last_assessed_at?: string | null;
  lastAssessedAt?: string | null;
  rating_status?: RatingStatus | null;
  ratingStatus?: RatingStatus | null;
  security_status?: SecurityStatus | null;
  securityStatus?: SecurityStatus | null;
};

export type ToolRatingDisplay = {
  status: RatingStatus;
  score: number | null;
  criteriaCompleted: number;
  numericAllowed: boolean;
  tierLabel: string | null;
  /** Full public label, e.g. "3.8/5 (Provisional — 7/10 criteria assessed)" */
  label: string;
  /** Compact label for cards */
  shortLabel: string;
  faqText: string;
};

export type ToolSecurityDisplay = {
  status: SecurityStatus;
  score: number | null;
  /** e.g. "Security: Not Yet Assessed" */
  label: string;
  shortLabel: string;
  faqText: string;
};

function num(value: number | string | null | undefined): number | null {
  if (value == null || value === '') return null;
  const n = typeof value === 'number' ? value : Number(value);
  return Number.isFinite(n) ? n : null;
}

function criteriaCompletedOf(tool: ToolRatingFields): number {
  const raw = tool.criteria_completed ?? tool.criteriaCompleted ?? 0;
  const n = Math.round(Number(raw) || 0);
  return Math.max(0, Math.min(RATING_FULL, n));
}

function overallScoreOf(tool: ToolRatingFields): number | null {
  return num(tool.overall_score ?? tool.overallScore);
}

function securityScoreOf(tool: ToolRatingFields): number | null {
  return num(tool.security_criterion_score ?? tool.securityCriterionScore);
}

export function getRatingStatus(criteriaCompleted: number): RatingStatus {
  if (criteriaCompleted < RATING_MIN_PROVISIONAL) return 'NOT_YET_RATED';
  if (criteriaCompleted < RATING_FULL) return 'PROVISIONAL';
  return 'RATED';
}

export function getSecurityStatus(securityCriterionScore: number | null): SecurityStatus {
  if (securityCriterionScore == null) return 'NOT_ASSESSED';
  if (securityCriterionScore < SECURITY_VERIFIED_MIN) return 'FLAGGED';
  return 'VERIFIED';
}

export function getTierLabel(score: number): string {
  if (score >= 4.5) return 'Outstanding';
  if (score >= 4.0) return 'Excellent';
  if (score >= 3.5) return 'Strong';
  if (score >= 3.0) return 'Good';
  if (score >= 2.0) return 'Fair';
  return 'Needs Improvement';
}

export function getToolRatingDisplay(tool: ToolRatingFields): ToolRatingDisplay {
  const criteriaCompleted = criteriaCompletedOf(tool);
  const status =
    tool.rating_status ??
    tool.ratingStatus ??
    getRatingStatus(criteriaCompleted);
  const rawScore = overallScoreOf(tool);
  const numericAllowed = status !== 'NOT_YET_RATED' && rawScore != null;
  const score = numericAllowed ? rawScore : null;
  const scoreText = score != null ? `${score.toFixed(1)}/5` : null;
  const tierLabel = status === 'RATED' && score != null ? getTierLabel(score) : null;

  if (status === 'NOT_YET_RATED' || !numericAllowed) {
    return {
      status: 'NOT_YET_RATED',
      score: null,
      criteriaCompleted,
      numericAllowed: false,
      tierLabel: null,
      label: 'Not Yet Rated',
      shortLabel: 'Not Yet Rated',
      faqText: 'has not yet been rated on our 10-point evaluation framework',
    };
  }

  if (status === 'PROVISIONAL') {
    const completeness = `Provisional — ${criteriaCompleted}/10 criteria assessed`;
    const label = `${scoreText} (${completeness})`;
    return {
      status,
      score,
      criteriaCompleted,
      numericAllowed: true,
      tierLabel: null,
      label,
      shortLabel: `${scoreText} (Provisional — ${criteriaCompleted}/10)`,
      faqText: `is provisionally rated ${scoreText} (${criteriaCompleted}/10 criteria assessed)`,
    };
  }

  const label = `${scoreText} · ${tierLabel}`;
  return {
    status: 'RATED',
    score,
    criteriaCompleted,
    numericAllowed: true,
    tierLabel,
    label,
    shortLabel: label,
    faqText: `is rated ${scoreText} (${tierLabel}) on our 10-point evaluation framework`,
  };
}

export function getToolSecurityDisplay(tool: ToolRatingFields): ToolSecurityDisplay {
  const score = securityScoreOf(tool);
  const status =
    tool.security_status ??
    tool.securityStatus ??
    getSecurityStatus(score);

  if (status === 'NOT_ASSESSED') {
    return {
      status,
      score: null,
      label: 'Security: Not Yet Assessed',
      shortLabel: 'Security: Not Yet Assessed',
      faqText:
        'has not yet been assessed on our Security & Data Privacy criterion. Check the vendor’s own security documentation before using it for sensitive data',
    };
  }

  if (status === 'FLAGGED') {
    return {
      status,
      score,
      label: 'Security: Flagged',
      shortLabel: 'Security: Flagged',
      faqText:
        'is flagged on our Security & Data Privacy criterion (scored below 12/20). Review the full assessment before using it for sensitive startup data',
    };
  }

  return {
    status: 'VERIFIED',
    score,
    label: 'Security: Verified',
    shortLabel: 'Security: Verified',
    faqText:
      'is security-verified (Security & Data Privacy scored 12/20 or above on our 10-point framework)',
  };
}

export function formatAssessedDate(iso: string | null | undefined): string | null {
  if (!iso) return null;
  const date = new Date(iso);
  if (Number.isNaN(date.getTime())) return null;
  return date.toLocaleDateString('en-IN', {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
  });
}
