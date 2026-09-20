import { ReticleDev } from './reticle-dev';
import type { Metadata } from "next";
import { Inter, Bricolage_Grotesque } from "next/font/google";
import Script from "next/script";
import "./globals.css";
import { ReCaptchaProvider } from "@/lib/recaptcha";
import { CurrencyProvider } from "@/lib/currency";
import { STATS, withLiveCount } from "@/lib/constants/stats";
import { SITE_URL } from "@/lib/constants/site";
import { fetchDirectoryStats } from "@/lib/api/toolsStats";
import { organizationJsonLd } from "@/lib/utils/seo";
import ProfileCompletionCheck from "@/components/features/auth/ProfileCompletionCheck";

const inter = Inter({
  variable: "--font-inter",
  subsets: ["latin"],
  weight: ["400", "500", "600", "700", "800", "900"],
});

const bricolageGrotesque = Bricolage_Grotesque({
  variable: "--font-bricolage-grotesque",
  subsets: ["latin"],
});

export async function generateMetadata(): Promise<Metadata> {
  const stats = await fetchDirectoryStats();
  const description = `Discover ${withLiveCount(stats?.total_tools, 'AI tools')}, ${withLiveCount(stats?.agent_count, 'agents')}, ${STATS.llmsCompared} LLMs, and ${STATS.researchPapers} research papers. Compare pricing, benchmarks, and security ratings. Built for startup founders.`;

  return {
    metadataBase: new URL(SITE_URL),
    title: {
      default: 'One9Founders | India\'s #1 AI Ecosystem Navigator',
      template: '%s | One9Founders',
    },
    description,
    keywords: [
      'best ai tools',
      'ai agents',
      'AI tools for startups',
      'AI tools directory',
      'compare AI tools India',
      'LLM comparison',
      'security validated AI tools',
      'unbiased AI tool reviews',
      'startup tools',
      'founder resources',
      'AI research papers',
    ],
    authors: [{ name: 'One9Founders' }],
    creator: 'One9Founders',
    publisher: 'One9Founders',
    manifest: '/site.webmanifest',
    themeColor: '#C47A3A',
    icons: {
      icon: [
        { url: '/favicon.ico', sizes: 'any' },
        { url: '/favicon-16x16.png', sizes: '16x16', type: 'image/png' },
        { url: '/favicon-32x32.png', sizes: '32x32', type: 'image/png' },
      ],
      apple: [
        { url: '/apple-touch-icon.png', sizes: '180x180', type: 'image/png' },
      ],
      other: [
        { url: '/android-chrome-192x192.png', sizes: '192x192', type: 'image/png' },
        { url: '/android-chrome-512x512.png', sizes: '512x512', type: 'image/png' },
      ],
    },
    openGraph: {
      type: 'website',
      locale: 'en_US',
      url: SITE_URL,
      siteName: 'One9Founders',
      title: 'One9Founders | India\'s #1 AI Ecosystem Navigator',
      description,
      images: [{
        url: '/og-image.png',
        width: 1200,
        height: 630,
        alt: 'One9Founders - India\'s #1 AI Ecosystem Navigator',
      }],
    },
    twitter: {
      card: 'summary_large_image',
      site: '@one9founders',
      title: 'One9Founders | India\'s #1 AI Ecosystem Navigator',
      description,
      images: ['/og-image.png'],
      creator: '@one9founders',
    },
    robots: {
      index: true,
      follow: true,
      googleBot: {
        index: true,
        follow: true,
        'max-video-preview': -1,
        'max-image-preview': 'large',
        'max-snippet': -1,
      },
    },
  };
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <head>
        <meta name="viewport" content="width=device-width, initial-scale=1, maximum-scale=5" />
        <link rel="author" href="/llms.txt" type="text/plain" />
        <link rel="alternate" type="text/plain" href="/llms.txt" title="llms.txt" />
        <link rel="alternate" type="text/plain" href="/aeo.txt" title="aeo.txt" />
        <link rel="alternate" type="text/plain" href="/geo.txt" title="geo.txt" />
        {/* gtag stays async; Contentsquare loads after the page is interactive to protect mobile INP */}
        <script async src="https://www.googletagmanager.com/gtag/js?id=G-455BX3CJP8"></script>
        <script dangerouslySetInnerHTML={{
          __html: `
            window.dataLayer = window.dataLayer || [];
            function gtag(){dataLayer.push(arguments);}
            gtag('js', new Date());
            gtag('config', 'G-455BX3CJP8');
          `
        }} />
      </head>
      <body
        className={`${inter.variable} ${bricolageGrotesque.variable} antialiased`}
      >
        {process.env.NODE_ENV === 'development' ? <ReticleDev /> : null}
        <Script
          id="contentsquare"
          src="https://t.contentsquare.net/uxa/d11fb4e793d48.js"
          strategy="lazyOnload"
        />
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(organizationJsonLd()) }}
        />
        <CurrencyProvider>
          <ReCaptchaProvider>
            {children}
            <ProfileCompletionCheck />
          </ReCaptchaProvider>
        </CurrencyProvider>
      </body>
    </html>
  );
}
