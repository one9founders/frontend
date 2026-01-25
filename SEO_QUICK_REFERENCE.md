# Quick SEO Reference Guide

## Adding SEO to a New Page

### For Server Components (Recommended)

```typescript
import { Metadata } from 'next';
import { generateSEO, generateStructuredData } from '@/lib/utils/seo';

export const metadata: Metadata = generateSEO({
  title: 'Your Page Title',
  description: 'Your page description (150-160 chars)',
  path: '/your-page-path',
  keywords: ['keyword1', 'keyword2', 'keyword3'],
  image: '/custom-og-image.jpg', // Optional
  type: 'website', // or 'article'
});

export default function YourPage() {
  return (
    <div>
      {/* Optional: Add structured data */}
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify(
            generateStructuredData({
              '@type': 'WebPage',
              name: 'Your Page Name',
              description: 'Your page description',
              url: 'https://one9founders.com/your-page-path',
            })
          ),
        }}
      />
      
      {/* Your page content */}
    </div>
  );
}
```

### For Client Components

Create two files:

**YourPageClient.tsx:**
```typescript
'use client';

export default function YourPageClient() {
  // Your client component code
  return <div>Your content</div>;
}
```

**page.tsx:**
```typescript
import { Metadata } from 'next';
import { generateSEO } from '@/lib/utils/seo';
import YourPageClient from './YourPageClient';

export const metadata: Metadata = generateSEO({
  title: 'Your Page Title',
  description: 'Your page description',
  path: '/your-page-path',
});

export default function YourPage() {
  return <YourPageClient />;
}
```

## Common Structured Data Schemas

### Article/Blog Post
```typescript
generateStructuredData({
  '@type': 'Article',
  headline: 'Article Title',
  description: 'Article description',
  image: 'https://one9founders.com/article-image.jpg',
  datePublished: '2024-01-01',
  dateModified: '2024-01-15',
  author: {
    '@type': 'Person',
    name: 'Author Name',
  },
})
```

### Product/Tool
```typescript
generateStructuredData({
  '@type': 'SoftwareApplication',
  name: 'Tool Name',
  description: 'Tool description',
  applicationCategory: 'BusinessApplication',
  operatingSystem: 'Web',
  offers: {
    '@type': 'Offer',
    price: '0',
    priceCurrency: 'USD',
  },
})
```

### FAQ
```typescript
generateStructuredData({
  '@type': 'FAQPage',
  mainEntity: [
    {
      '@type': 'Question',
      name: 'Question 1?',
      acceptedAnswer: {
        '@type': 'Answer',
        text: 'Answer 1',
      },
    },
  ],
})
```

## Using External Links

```typescript
import ExternalLink from '@/components/shared/ExternalLink';

// Automatically adds rel="noopener nofollow" to external links
<ExternalLink href="https://external-site.com">
  External Link
</ExternalLink>

// Internal links work normally
<ExternalLink href="/about">
  Internal Link
</ExternalLink>
```

## Image Best Practices

```typescript
// Always include alt text
<img 
  src="/image.jpg" 
  alt="Descriptive text about the image"
  width={1200}
  height={628}
/>

// Use Next.js Image component for optimization
import Image from 'next/image';

<Image
  src="/image.jpg"
  alt="Descriptive text"
  width={1200}
  height={628}
  priority // For above-the-fold images
/>
```

## Updating Sitemap

When adding new dynamic pages, update `/src/app/sitemap.ts`:

```typescript
export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const baseUrl = 'https://one9founders.com';
  
  // Fetch your dynamic data
  const items = await getYourItems();
  
  const dynamicPages = items.map((item) => ({
    url: `${baseUrl}/your-route/${item.id}`,
    lastModified: new Date(item.updated_at),
    changeFrequency: 'weekly' as const,
    priority: 0.7,
  }));
  
  return [...staticPages, ...dynamicPages];
}
```

## SEO Checklist for New Pages

- [ ] Add metadata using `generateSEO()`
- [ ] Title is 50-60 characters
- [ ] Description is 150-160 characters
- [ ] Add relevant keywords
- [ ] Include structured data if applicable
- [ ] All images have alt text
- [ ] External links use `ExternalLink` component
- [ ] Add page to sitemap.ts
- [ ] Test with Lighthouse (target 90+ SEO score)
- [ ] Verify in Google Search Console after deployment

## Common Mistakes to Avoid

❌ Title too long (>60 chars)
❌ Description too long (>160 chars)
❌ Missing alt text on images
❌ External links without nofollow
❌ Duplicate meta descriptions
❌ Missing canonical URL
❌ Not adding page to sitemap
❌ Using client components without metadata wrapper

## Testing Your SEO

1. **Local Testing:**
   ```bash
   npm run build
   npm run start
   # Visit http://localhost:3000
   ```

2. **View Source:**
   - Right-click > View Page Source
   - Check for meta tags in `<head>`

3. **Lighthouse Audit:**
   - Chrome DevTools > Lighthouse
   - Run SEO audit
   - Target score: 95+

4. **Social Media Preview:**
   - Facebook: https://developers.facebook.com/tools/debug/
   - Twitter: https://cards-dev.twitter.com/validator
   - LinkedIn: https://www.linkedin.com/post-inspector/

## Need Help?

Refer to:
- `/src/lib/utils/seo.ts` - SEO utility functions
- `SEO_IMPLEMENTATION.md` - Full implementation guide
- Next.js Metadata docs: https://nextjs.org/docs/app/building-your-application/optimizing/metadata
