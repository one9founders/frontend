import { mkdir, writeFile } from 'node:fs/promises';
import { join } from 'node:path';

const OUTPUT_DIR = join(process.cwd(), 'data', 'pipeline');

export async function writePipelineJson(filename: string, data: unknown): Promise<void> {
  await mkdir(OUTPUT_DIR, { recursive: true });
  await writeFile(join(OUTPUT_DIR, filename), `${JSON.stringify(data, null, 2)}\n`, 'utf8');
}

export function daysAgoIsoDate(days: number): string {
  const date = new Date();
  date.setUTCDate(date.getUTCDate() - days);
  return date.toISOString().slice(0, 10);
}

export function decodeXmlEntities(value: string): string {
  return value
    .replace(/<!\[CDATA\[([\s\S]*?)\]\]>/g, '$1')
    .replace(/&lt;/g, '<')
    .replace(/&gt;/g, '>')
    .replace(/&quot;/g, '"')
    .replace(/&apos;/g, "'")
    .replace(/&#(\d+);/g, (_, code) => String.fromCharCode(Number(code)))
    .replace(/&#x([0-9a-fA-F]+);/g, (_, hex) => String.fromCharCode(parseInt(hex, 16)))
    .replace(/&amp;/g, '&')
    .trim();
}

export function innerTag(block: string, tag: string): string {
  const match = block.match(new RegExp(`<${tag}(?:\\s[^>]*)?>([\\s\\S]*?)</${tag}>`, 'i'));
  return match ? decodeXmlEntities(match[1]) : '';
}

export function allInnerTags(block: string, tag: string): string[] {
  const matches = block.matchAll(new RegExp(`<${tag}(?:\\s[^>]*)?>([\\s\\S]*?)</${tag}>`, 'gi'));
  return [...matches].map((match) => decodeXmlEntities(match[1])).filter(Boolean);
}
