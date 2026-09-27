'use client';

import { useEffect, useState } from 'react';
import { isListingSaved, toggleSavedListing, type SavedListing } from '@/lib/savedTools';
import { trackCatalogEvent } from '@/lib/catalogEvents';

type Props = Omit<SavedListing, 'savedAt'> & {
  entityId?: string | number | null;
  className?: string;
};

export default function SaveListingButton({
  slug,
  name,
  path,
  kind,
  entityId,
  className = '',
}: Props) {
  const [saved, setSaved] = useState(false);

  useEffect(() => {
    setSaved(isListingSaved(path));
  }, [path]);

  return (
    <button
      type="button"
      aria-pressed={saved}
      className={`px-3 py-2 text-sm border border-[var(--line)] text-[var(--paper)] hover:border-[var(--copper-dim)] cursor-pointer ${className}`}
      onClick={() => {
        const nowSaved = toggleSavedListing({ slug, name, path, kind });
        setSaved(nowSaved);
        if (nowSaved) {
          trackCatalogEvent({
            event_name: 'tool_saved',
            entity_type: kind === 'agent' ? 'agent' : 'tool',
            entity_id: entityId,
            entity_slug: slug,
            surface: 'save_button',
          });
        }
      }}
    >
      {saved ? 'Saved' : 'Save'}
    </button>
  );
}
