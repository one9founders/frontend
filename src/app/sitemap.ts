import { MetadataRoute } from 'next';

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const baseUrl = 'https://one9founders.com';
  
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

  // TODO: Add dynamic tool pages when you have the data
  // const tools = await getAllTools();
  // const toolPages = tools.map((tool) => ({
  //   url: `${baseUrl}/tool/${tool.id}`,
  //   lastModified: new Date(tool.updated_at),
  //   changeFrequency: 'monthly' as const,
  //   priority: 0.6,
  // }));

  return [...staticPages];
}
