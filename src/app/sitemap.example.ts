// Example: How to update sitemap.ts to include dynamic tool pages
// This file shows you how to add your tools to the sitemap once you have the data

import { MetadataRoute } from 'next';

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const baseUrl = 'https://www.one9founders.com';
  
  // Static pages
  const staticPages = [
    '',
    '/about',
    '/deals',
    '/news',
    '/submit',
    '/terms',
    '/policy',
    '/internship',
    '/campus-internship',
  ].map((route) => ({
    url: `${baseUrl}${route}`,
    lastModified: new Date(),
    changeFrequency: 'weekly' as const,
    priority: route === '' ? 1 : 0.8,
  }));

  // ============================================================
  // EXAMPLE 1: Add tool pages (uncomment when ready)
  // ============================================================
  /*
  import { getAllTools } from '@/lib/actions/tools';
  
  const tools = await getAllTools();
  const toolPages = tools.map((tool: any) => ({
    url: `${baseUrl}/tool/${tool.id}`,
    lastModified: new Date(tool.updated_at || tool.created_at),
    changeFrequency: 'monthly' as const,
    priority: 0.7,
  }));
  */

  // ============================================================
  // EXAMPLE 2: Add news article pages (uncomment when ready)
  // ============================================================
  /*
  import { getNews } from '@/lib/api/newsService';
  
  const newsArticles = await getNews('All');
  const newsPages = newsArticles.map((article: any) => ({
    url: `${baseUrl}/news/${article.id}`,
    lastModified: new Date(article.updated_at || article.created_at),
    changeFrequency: 'monthly' as const,
    priority: 0.6,
  }));
  */

  // ============================================================
  // EXAMPLE 3: Add deal pages (uncomment when ready)
  // ============================================================
  /*
  import { getAllDeals } from '@/lib/actions/tools';
  
  const deals = await getAllDeals();
  const dealPages = deals.map((deal: any) => ({
    url: `${baseUrl}/deals/${deal.id}`,
    lastModified: new Date(deal.updated_at || deal.created_at),
    changeFrequency: 'weekly' as const,
    priority: 0.7,
  }));
  */

  // ============================================================
  // Return all pages (add your dynamic pages here)
  // ============================================================
  return [
    ...staticPages,
    // ...toolPages,      // Uncomment when tools are ready
    // ...newsPages,      // Uncomment when news pages are ready
    // ...dealPages,      // Uncomment when deal pages are ready
  ];
}

// ============================================================
// TIPS FOR UPDATING SITEMAP
// ============================================================
/*

1. WHEN TO UPDATE:
   - When you add new tool pages
   - When you add new blog/news articles
   - When you add new deal pages
   - When you add any new content pages

2. HOW TO UPDATE:
   - Uncomment the relevant example above
   - Adjust the import paths to match your actual functions
   - Adjust the URL structure to match your routes
   - Set appropriate changeFrequency and priority

3. CHANGE FREQUENCY GUIDE:
   - 'always'  - Changes every time it's accessed
   - 'hourly'  - Changes hourly
   - 'daily'   - Changes daily
   - 'weekly'  - Changes weekly (good for most content)
   - 'monthly' - Changes monthly (good for stable content)
   - 'yearly'  - Changes yearly
   - 'never'   - Archived content

4. PRIORITY GUIDE (0.0 to 1.0):
   - 1.0 - Homepage
   - 0.8 - Main category pages (about, deals, news)
   - 0.7 - Important content (featured tools, deals)
   - 0.6 - Regular content (articles, tools)
   - 0.5 - Less important pages
   - 0.3 - Archive pages

5. TESTING:
   After updating, test locally:
   - npm run build
   - npm run start
   - Visit http://localhost:3000/sitemap.xml
   - Verify all URLs are present

6. AFTER DEPLOYMENT:
   - Go to Google Search Console
   - Navigate to Sitemaps section
   - Click "Resubmit" or wait for automatic crawl
   - Check for any errors

7. PERFORMANCE TIP:
   If you have thousands of pages, consider:
   - Caching the sitemap
   - Using sitemap index files
   - Paginating large datasets

*/
