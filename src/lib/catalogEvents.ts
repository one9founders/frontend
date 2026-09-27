const API_URL = process.env.NEXT_PUBLIC_API_URL || 'https://api.one9founders.com';

export type CatalogEventName =
  | 'search_submitted'
  | 'results_displayed'
  | 'result_selected'
  | 'detail_view'
  | 'official_site_click'
  | 'compare_added'
  | 'compare_completed'
  | 'tool_saved'
  | 'submission_started'
  | 'submission_validation_failed'
  | 'submission_completed'
  | 'service_inquiry_started'
  | 'service_inquiry_submitted'
  | 'product_activation';

export type CatalogEventInput = {
  event_name: CatalogEventName;
  entity_type?: 'tool' | 'agent' | 'service' | 'product' | '';
  entity_id?: string | number | null;
  entity_slug?: string;
  surface?: string;
  result_position?: number | null;
  query_id?: string;
  context?: {
    results_count?: number;
    offer?: string;
    sort?: string;
    filter_count?: number;
  };
};

const SESSION_KEY = 'one9_catalog_session';

export function catalogSessionId(): string {
  if (typeof window === 'undefined') return '';
  try {
    const existing = sessionStorage.getItem(SESSION_KEY);
    if (existing) return existing;
    const created = crypto.randomUUID();
    sessionStorage.setItem(SESSION_KEY, created);
    return created;
  } catch {
    return '';
  }
}

export function campaignFromLocation(): string {
  if (typeof window === 'undefined') return '';
  return new URLSearchParams(window.location.search).get('utm_campaign') || '';
}

/** Server event is the ranking source. Failures never block navigation. */
export function trackCatalogEvent(input: CatalogEventInput): void {
  if (typeof window === 'undefined') return;
  const eventId = crypto.randomUUID();
  const body = {
    event_name: input.event_name,
    event_id: eventId,
    entity_type: input.entity_type || '',
    entity_id: input.entity_id == null ? '' : String(input.entity_id),
    entity_slug: input.entity_slug || '',
    surface: input.surface || '',
    result_position: input.result_position ?? null,
    query_id: input.query_id || '',
    campaign: campaignFromLocation(),
    session_id: catalogSessionId(),
    context: input.context || {},
  };
  void fetch(`${API_URL}/track/event/`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(body),
    keepalive: true,
  }).catch(() => {});
}
