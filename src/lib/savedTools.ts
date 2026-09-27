export type SavedListing = {
  slug: string;
  name: string;
  path: string;
  kind: 'tool' | 'agent';
  savedAt: string;
};

const KEY = 'one9_saved_listings';

function read(): SavedListing[] {
  if (typeof window === 'undefined') return [];
  try {
    const raw = localStorage.getItem(KEY);
    const parsed = raw ? JSON.parse(raw) : [];
    return Array.isArray(parsed) ? parsed : [];
  } catch {
    return [];
  }
}

function write(rows: SavedListing[]) {
  localStorage.setItem(KEY, JSON.stringify(rows));
}

export function listSavedListings(): SavedListing[] {
  return read();
}

export function isListingSaved(path: string): boolean {
  return read().some((row) => row.path === path);
}

export function toggleSavedListing(listing: Omit<SavedListing, 'savedAt'>): boolean {
  const rows = read();
  const existing = rows.findIndex((row) => row.path === listing.path);
  if (existing >= 0) {
    rows.splice(existing, 1);
    write(rows);
    return false;
  }
  rows.unshift({ ...listing, savedAt: new Date().toISOString() });
  write(rows);
  return true;
}
