import { hasSubstantiveContent } from '../src/lib/tool-content';
import type { Tool } from '../src/types';

const API_URL = process.env.NEXT_PUBLIC_API_URL || 'https://api.one9founders.com';
const PAGE_SIZE = 200;

interface PaginatedTools {
  results?: Tool[];
  next?: string | null;
}

async function fetchAllTools(): Promise<Tool[]> {
  const tools: Tool[] = [];
  let url: string | null = `${API_URL}/tools/?page_size=${PAGE_SIZE}`;

  while (url) {
    const response = await fetch(url, {
      headers: { 'User-Agent': 'one9founders-count-indexable-tools' },
    });
    if (!response.ok) {
      throw new Error(`Request failed ${response.status} for ${url}`);
    }
    const data = (await response.json()) as PaginatedTools;
    tools.push(...(data.results || []));
    url = data.next || null;
    process.stderr.write(`\rFetched ${tools.length} tools...`);
  }
  process.stderr.write('\n');
  return tools;
}

async function main() {
  const tools = await fetchAllTools();
  const missingDescription = tools.filter((tool) => typeof tool.description !== 'string').length;
  if (missingDescription > 0) {
    console.error(
      `warning: ${missingDescription}/${tools.length} list records omit description; ` +
        'hasSubstantiveContent will treat those as 0 words until the list serializer includes it.'
    );
  }

  let assessed = 0;
  let content = 0;
  let either = 0;
  let neither = 0;

  for (const tool of tools) {
    const isAssessed = tool.assessed === true;
    const hasContent = hasSubstantiveContent(tool);
    if (isAssessed) assessed += 1;
    if (hasContent) content += 1;
    if (isAssessed || hasContent) either += 1;
    else neither += 1;
  }

  console.log(`total: ${tools.length}`);
  console.log(`assessed === true: ${assessed}`);
  console.log(`hasSubstantiveContent() === true: ${content}`);
  console.log(`either (indexable / sitemap): ${either}`);
  console.log(`neither (noindex / excluded): ${neither}`);
}

main().catch((error) => {
  console.error(error);
  process.exit(1);
});
