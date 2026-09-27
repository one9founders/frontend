export type PopularityDisplay = {
  state: 'unavailable' | 'bounded' | 'unbounded';
  value: number | null;
  label: string;
  detail: string;
};

type PopularityPayload = {
  state?: string | null;
  value?: number | null;
} | null;

/** Prefer the API payload. Fall back to the raw score without clamping it to 100. */
export function popularityFromRecord(
  score: number | string | null | undefined,
  payload?: PopularityPayload,
): PopularityDisplay {
  if (payload && payload.state === 'unavailable') return popularityDisplay(null);
  if (payload && (payload.state === 'bounded' || payload.state === 'unbounded')) {
    return popularityDisplay(payload.value);
  }
  return popularityDisplay(score);
}

export function popularityDisplay(score: number | string | null | undefined): PopularityDisplay {
  const parsed = typeof score === 'string' ? Number(score) : score;
  if (parsed == null || !Number.isFinite(parsed) || parsed <= 0) {
    return {
      state: 'unavailable',
      value: null,
      label: 'Unavailable',
      detail: 'No popularity measurement is recorded for this listing.',
    };
  }
  if (parsed > 100) {
    return {
      state: 'unbounded',
      value: parsed,
      label: String(parsed),
      detail:
        'Source activity signal. It is outside 0–100, so it is not shown as a percentage or rating.',
    };
  }
  return {
    state: 'bounded',
    value: parsed,
    label: String(parsed),
    detail: 'Source activity signal from 1 to 100. It is not an editorial rating.',
  };
}
