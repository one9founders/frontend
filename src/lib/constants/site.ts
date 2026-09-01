/** Canonical public origin. All SEO URLs must use this host, not the apex. */
export const SITE_URL = 'https://www.one9founders.com';
export const SITE_NAME = 'One9Founders';
export const SITE_APEX_HOST = 'one9founders.com';
export const SITE_CANONICAL_HOST = 'www.one9founders.com';

/**
 * Pathname only. Drops query/hash (utm_*, ref, sort, filter, page, search,
 * click ids, and anything else) so canonicals stay self-referencing on the
 * clean www URL.
 */
export function canonicalPath(input = ''): string {
  let value = input.trim();
  if (!value || value === '/') return '/';

  try {
    if (/^https?:\/\//i.test(value)) {
      value = new URL(value).pathname;
    }
  } catch {
    // Use the raw value and still strip ?/# below.
  }

  const cut = value.search(/[?#]/);
  if (cut !== -1) value = value.slice(0, cut);
  if (!value.startsWith('/')) value = `/${value}`;
  if (value.length > 1) value = value.replace(/\/+$/, '');
  return value || '/';
}

export function siteUrl(path = ''): string {
  const cleaned = canonicalPath(path);
  return cleaned === '/' ? SITE_URL : `${SITE_URL}${cleaned}`;
}
