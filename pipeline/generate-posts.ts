import { mkdir, readdir, writeFile } from 'node:fs/promises';
import { join } from 'node:path';

interface SheetRow {
  title: string;
  sourceUrl: string;
  sourceType: string;
  summary: string;
  myTake: string;
  jobCluster: string;
  approved: string;
  publishDate: string;
}

const REQUIRED_COLUMNS = [
  'title',
  'sourceUrl',
  'sourceType',
  'summary',
  'myTake',
  'jobCluster',
  'approved',
  'publishDate',
] as const;

const DEFAULT_SHEET_CSV_URL =
  'https://docs.google.com/spreadsheets/d/1UcagD9hdr1wA5Xj-v_G3BFvPnSXefcMpXFFm4ErgINw/export?format=csv&gid=0';

function parseCsv(text: string): string[][] {
  const input = text.charCodeAt(0) === 0xfeff ? text.slice(1) : text;
  const rows: string[][] = [];
  let row: string[] = [];
  let field = '';
  let inQuotes = false;

  for (let i = 0; i < input.length; i++) {
    const char = input[i];
    if (inQuotes) {
      if (char === '"') {
        if (input[i + 1] === '"') {
          field += '"';
          i += 1;
        } else {
          inQuotes = false;
        }
      } else {
        field += char;
      }
      continue;
    }

    if (char === '"') {
      inQuotes = true;
    } else if (char === ',') {
      row.push(field);
      field = '';
    } else if (char === '\n') {
      row.push(field);
      rows.push(row);
      row = [];
      field = '';
    } else if (char !== '\r') {
      field += char;
    }
  }

  if (field.length > 0 || row.length > 0) {
    row.push(field);
    rows.push(row);
  }

  return rows.filter((cells) => cells.some((cell) => cell.trim() !== ''));
}

function rowsToObjects(table: string[][]): SheetRow[] {
  const [headerRow, ...dataRows] = table;
  if (!headerRow) {
    throw new Error(
      'Sheet CSV is empty. Add a header row: title, sourceUrl, sourceType, summary, myTake, jobCluster, approved, publishDate'
    );
  }

  const headers = headerRow.map((header) => header.trim());
  const missing = REQUIRED_COLUMNS.filter(
    (column) => !headers.some((header) => header.toLowerCase() === column.toLowerCase())
  );
  if (missing.length > 0) {
    throw new Error(`Sheet CSV is missing required columns: ${missing.join(', ')}`);
  }

  const indexFor = (name: string) =>
    headers.findIndex((header) => header.toLowerCase() === name.toLowerCase());

  return dataRows.map((cells) => ({
    title: (cells[indexFor('title')] || '').trim(),
    sourceUrl: (cells[indexFor('sourceUrl')] || '').trim(),
    sourceType: (cells[indexFor('sourceType')] || '').trim(),
    summary: (cells[indexFor('summary')] || '').trim(),
    myTake: (cells[indexFor('myTake')] || '').trim(),
    jobCluster: (cells[indexFor('jobCluster')] || '').trim(),
    approved: (cells[indexFor('approved')] || '').trim(),
    publishDate: (cells[indexFor('publishDate')] || '').trim(),
  }));
}

function parsePublishDate(raw: string): { iso: string; utc: Date } | null {
  const value = raw.trim();
  if (!value) return null;

  const isoMatch = value.match(/^(\d{4})-(\d{2})-(\d{2})/);
  if (isoMatch) {
    const utc = new Date(Date.UTC(Number(isoMatch[1]), Number(isoMatch[2]) - 1, Number(isoMatch[3])));
    return Number.isNaN(utc.getTime()) ? null : { iso: utc.toISOString().slice(0, 10), utc };
  }

  const parsed = new Date(value);
  if (Number.isNaN(parsed.getTime())) return null;
  const utc = new Date(Date.UTC(parsed.getFullYear(), parsed.getMonth(), parsed.getDate()));
  return { iso: utc.toISOString().slice(0, 10), utc };
}

function startOfTodayUtc(): Date {
  const now = new Date();
  return new Date(Date.UTC(now.getUTCFullYear(), now.getUTCMonth(), now.getUTCDate()));
}

function isApproved(value: string): boolean {
  return value.trim().toLowerCase() === 'yes';
}

function slugify(title: string): string {
  const slug = title
    .toLowerCase()
    .normalize('NFKD')
    .replace(/[^\w\s-]/g, '')
    .trim()
    .replace(/[\s_]+/g, '-')
    .replace(/-+/g, '-')
    .replace(/^-|-$/g, '')
    .slice(0, 80);
  return slug || 'post';
}

function yamlScalar(value: string): string {
  return JSON.stringify(value);
}

function tagsFromJobCluster(jobCluster: string): string[] {
  return jobCluster
    .split(/[,/|]/)
    .map((tag) => tag.trim())
    .filter(Boolean);
}

function sourceHost(url: string): string {
  try {
    return new URL(url).hostname.replace(/^www\./, '');
  } catch {
    return url;
  }
}

function renderMdx(row: SheetRow, date: string): string {
  const tags = tagsFromJobCluster(row.jobCluster);
  const tagBlock = tags.length > 0 ? `tags:\n${tags.map((tag) => `  - ${yamlScalar(tag)}`).join('\n')}` : 'tags: []';
  const attributionType = row.sourceType ? ` ${row.sourceType}` : '';
  const host = row.sourceUrl ? sourceHost(row.sourceUrl) : '';

  const parts = [
    '---',
    `title: ${yamlScalar(row.title)}`,
    `date: ${yamlScalar(date)}`,
    `summary: ${yamlScalar(row.summary)}`,
    tagBlock,
    '---',
    '',
  ];

  if (row.summary) {
    parts.push(row.summary, '');
  }

  if (row.myTake) {
    parts.push('## Why this matters', '', row.myTake, '');
  }

  if (row.sourceUrl) {
    parts.push(
      '## Source',
      '',
      `This note is our take on a${attributionType} published by ${host || 'the original source'}. We are linking out for attribution rather than reproducing that coverage.`,
      '',
      `<a href="${row.sourceUrl.replace(/"/g, '&quot;')}" rel="noopener" target="_blank">Read the original on ${host || 'the source site'}</a>`,
      ''
    );
  }

  return parts.join('\n');
}

async function main() {
  const sheetUrl = process.env.SHEET_CSV_URL || DEFAULT_SHEET_CSV_URL;

  const response = await fetch(sheetUrl, {
    headers: { 'User-Agent': 'one9founders-content-generate' },
  });
  if (!response.ok) {
    throw new Error(`Failed to fetch sheet CSV (${response.status}): ${response.statusText}`);
  }

  const csv = await response.text();
  if (!csv.trim()) {
    throw new Error(
      'Sheet CSV is empty (zero bytes). The linked spreadsheet currently has no header or rows. Add the column headers and at least one approved row, then re-run.'
    );
  }
  if (csv.trimStart().startsWith('<!DOCTYPE') || csv.trimStart().startsWith('<html')) {
    throw new Error('SHEET_CSV_URL returned HTML instead of CSV. Publish the sheet to the web or use the /export?format=csv URL.');
  }

  const rows = rowsToObjects(parseCsv(csv));
  await mkdir(CONTENT_DIR, { recursive: true });
  const existing = new Set(await readdir(CONTENT_DIR));
  const today = startOfTodayUtc();

  let written = 0;
  let skippedExisting = 0;
  let skippedFilter = 0;

  for (const row of rows) {
    if (!row.title) {
      skippedFilter += 1;
      continue;
    }

    const parsedDate = parsePublishDate(row.publishDate);
    if (!isApproved(row.approved) || !parsedDate || parsedDate.utc > today) {
      skippedFilter += 1;
      continue;
    }

    const filename = `${parsedDate.iso}-${slugify(row.title)}.mdx`;
    if (existing.has(filename)) {
      skippedExisting += 1;
      continue;
    }

    await writeFile(join(CONTENT_DIR, filename), renderMdx(row, parsedDate.iso), 'utf8');
    existing.add(filename);
    written += 1;
    console.log(`wrote content/blog/${filename}`);
  }

  console.log(
    `content:generate summary: written=${written} skipped_existing=${skippedExisting} skipped_filter=${skippedFilter}`
  );
}

main().catch((error) => {
  console.error(error instanceof Error ? error.message : error);
  process.exit(1);
});
