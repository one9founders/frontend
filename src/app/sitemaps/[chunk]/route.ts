import { SITE_URL } from '@/lib/constants/site';
import {
  getAuthorSitemapPage,
  getNewsSitemapPage,
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

  const authors = name.match(/^authors-(\d+)$/);
  if (authors) {
    const page = Number(authors[1]);
    const items = await getAuthorSitemapPage(page);
    return sitemapXmlResponse(
      toUrlsetXml(
        items
          .filter((author) => author.slug)
          .map((author) => ({
            url: `${SITE_URL}/research/authors/${author.slug}`,
            lastModified: author.last_seen ? new Date(author.last_seen) : new Date(),
            changeFrequency: 'weekly',
            priority: 0.5,
          })),
      ),
    );
  }

  const news = name.match(/^news-(\d+)$/);
  if (news) {
    const page = Number(news[1]);
    const items = await getNewsSitemapPage(page);
    return sitemapXmlResponse(
      toUrlsetXml(
        items
          .filter((article) => article.slug)
          .map((article) => ({
            url: `${SITE_URL}/news/${article.slug}`,
            lastModified: article.updated_at
              ? new Date(article.updated_at)
              : article.published_at
                ? new Date(article.published_at)
                : new Date(),
            changeFrequency: 'weekly',
            priority: 0.6,
          })),
      ),
    );
  }

  return emptySitemap();
}
