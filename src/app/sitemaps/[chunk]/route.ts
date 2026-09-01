import { SITE_URL } from '@/lib/constants/site';
import {
  getPaperSitemapPage,
  getStaticSitemapEntries,
  getToolSitemapPage,
  sitemapXmlResponse,
  toUrlsetXml,
} from '@/lib/api/sitemap';

export const revalidate = 3600;

function emptySitemap() {
  return sitemapXmlResponse(toUrlsetXml([]));
}

export async function GET(
  _request: Request,
  context: { params: Promise<{ chunk: string }> },
) {
  const { chunk } = await context.params;
  const name = chunk.replace(/\.xml$/, '');

  if (name === 'static') {
    return sitemapXmlResponse(toUrlsetXml(await getStaticSitemapEntries()));
  }

  const tools = name.match(/^tools-(\d+)$/);
  if (tools) {
    const page = Number(tools[1]);
    const items = await getToolSitemapPage(page);
    return sitemapXmlResponse(
      toUrlsetXml(
        items
          .filter((tool) => tool.slug)
          .map((tool) => ({
            url: `${SITE_URL}/tool/${tool.slug}`,
            lastModified: tool.updated_at ? new Date(tool.updated_at) : new Date(),
            changeFrequency: 'weekly',
            priority: 0.7,
          })),
      ),
    );
  }

  const papers = name.match(/^papers-(\d+)$/);
  if (papers) {
    const page = Number(papers[1]);
    const items = await getPaperSitemapPage(page);
    return sitemapXmlResponse(
      toUrlsetXml(
        items
          .filter((paper) => paper.arxiv_id)
          .map((paper) => ({
            url: `${SITE_URL}/research/${paper.arxiv_id}`,
            lastModified: paper.published_at ? new Date(paper.published_at) : new Date(),
            changeFrequency: 'monthly',
            priority: 0.5,
          })),
      ),
    );
  }

  return emptySitemap();
}
