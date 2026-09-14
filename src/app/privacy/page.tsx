import { Metadata } from 'next';
import { generateSEO } from '@/lib/utils/seo';
import Navbar from '@/components/layout/Navbar';
import Footer from '@/components/layout/Footer';

export const metadata: Metadata = generateSEO({
  title: 'Privacy Policy',
  description: 'Learn how One9Founders collects, uses, and protects your personal information, including emails submitted via our newsletter and signup forms.',
  path: '/privacy',
});

export default function PrivacyPolicy() {
  return (
    <div className="min-h-screen bg-[var(--gray-black)]">
      <Navbar />
      <div className="max-w-4xl mx-auto px-6 py-16">
        <h1 className="text-4xl font-bold mb-8 text-[var(--gray-200)]">Privacy Policy</h1>
        <div className="prose prose-invert max-w-none text-[var(--gray-400)] space-y-6">
          <p className="text-lg">
            <strong>Effective Date:</strong> January 1, 2026 · <strong>Last updated:</strong> September 14, 2026
          </p>

          <section>
            <h2 className="text-2xl font-semibold mb-4 text-[var(--gray-200)]">1. Information We Collect</h2>
            <p>We collect information you provide directly to us, including when you create an account, subscribe to our newsletter, submit a tool, or contact us. This may include your name, email address, and any other information you choose to provide.</p>
          </section>

          <section>
            <h2 className="text-2xl font-semibold mb-4 text-[var(--gray-200)]">2. How We Use Your Information</h2>
            <p>We use the information we collect to:</p>
            <ul className="list-disc pl-6 space-y-2">
              <li>Provide, maintain, and improve our services</li>
              <li>Send newsletters and product updates you opted into (you can unsubscribe at any time)</li>
              <li>Respond to comments, questions, and tool submissions</li>
              <li>Analyze usage patterns to enhance user experience</li>
            </ul>
          </section>

          <section>
            <h2 className="text-2xl font-semibold mb-4 text-[var(--gray-200)]">3. Information Sharing</h2>
            <p>We do not sell, trade, or otherwise transfer your personal information to third parties without your consent, except as described in this policy or as required by law.</p>
          </section>

          <section>
            <h2 className="text-2xl font-semibold mb-4 text-[var(--gray-200)]">4. Directory Listings — Independent Coverage</h2>
            <p>
              One9Founders operates an AI tools / agents / LLM directory for discovery and comparison.
              Listing a product, company, model, paper, or organization on One9Founders does{' '}
              <strong className="text-[var(--gray-200)]">not</strong> mean we are affiliated with,
              endorsed by, partnered with, sponsored by, or officially connected to that entity.
            </p>
            <p>
              We list publicly available tools and resources as part of our directory so founders can
              evaluate options. Brand names, logos, and product descriptions belong to their respective
              owners. Ratings and commentary on One9Founders reflect our published methodology and
              sources — not statements by the vendors themselves — unless we explicitly quote them.
            </p>
            <p>
              We do not accept affiliate commissions that change scores. See our{' '}
              <a href="/methodology" className="text-copper hover:text-copper-bright">methodology</a>{' '}
              and{' '}
              <a href="/terms" className="text-copper hover:text-copper-bright">terms of service</a>{' '}
              for how listings work.
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-semibold mb-4 text-[var(--gray-200)]">5. Data Security</h2>
            <p>We implement appropriate security measures to protect your personal information against unauthorized access, alteration, disclosure, or destruction.</p>
          </section>

          <section>
            <h2 className="text-2xl font-semibold mb-4 text-[var(--gray-200)]">6. Cookies and Analytics</h2>
            <p>We use cookies and similar technologies to enhance your browsing experience and analyze website traffic. We use analytics tools to understand how visitors interact with our site.</p>
          </section>

          <section>
            <h2 className="text-2xl font-semibold mb-4 text-[var(--gray-200)]">7. Your Rights</h2>
            <p>You have the right to access, update, or delete your personal information. You may also opt out of receiving promotional communications from us at any time by using the unsubscribe link in our emails or contacting us at hello@one9founders.com.</p>
          </section>

          <section>
            <h2 className="text-2xl font-semibold mb-4 text-[var(--gray-200)]">8. Changes to This Policy</h2>
            <p>We may update this privacy policy from time to time. We will notify you of any changes by posting the new policy on this page and updating the effective date.</p>
          </section>

          <section>
            <h2 className="text-2xl font-semibold mb-4 text-[var(--gray-200)]">9. Contact Us</h2>
            <p>If you have any questions about this privacy policy, contact us at <a href="mailto:hello@one9founders.com" className="text-copper hover:text-copper-bright">hello@one9founders.com</a>.</p>
          </section>
        </div>
      </div>
      <Footer />
    </div>
  );
}
