'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import { listSavedListings, type SavedListing } from '@/lib/savedTools';

export default function SavedListings() {
  const [rows, setRows] = useState<SavedListing[] | null>(null);

  useEffect(() => {
    setRows(listSavedListings());
  }, []);

  if (rows === null) {
    return <p className="text-sm text-[var(--gray-400)]">Loading saved listings…</p>;
  }
  if (rows.length === 0) {
    return (
      <p className="text-sm text-[var(--gray-400)]">
        Nothing saved yet. Use Save on a <Link href="/#tools-section" className="text-[var(--copper)]">tool</Link> or agent page.
      </p>
    );
  }
  return (
    <ul className="space-y-3">
      {rows.map((row) => (
        <li key={row.path} className="border border-[var(--line)] p-4">
          <Link href={row.path} className="text-[var(--paper)] hover:text-[var(--copper)]">{row.name}</Link>
          <p className="text-xs text-[var(--gray-500)] mt-1">{row.kind} · {row.path}</p>
        </li>
      ))}
    </ul>
  );
}
