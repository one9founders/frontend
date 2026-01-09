import Navbar from "../../components/layout/Navbar";
import Footer from "../../components/layout/Footer";

export default function PrivacyPolicy() {
  return (
    <div className="min-h-screen bg-[var(--gray-black)]">
      <Navbar />
      <div className="max-w-4xl mx-auto px-6 py-16">
        <h1 className="text-4xl font-bold mb-8 text-[var(--gray-200)]">Privacy Policy</h1>
        <div className="prose prose-invert max-w-none text-[var(--gray-400)] space-y-6">
          <p className="text-lg">
            <strong>Effective Date:</strong> January 1, 2026
          </p>
          
          <section>
            <h2 className="text-2xl font-semibold mb-4 text-[var(--gray-200)]">1. Information We Collect</h2>
            <p>We collect information you provide directly to us, such as when you create an account, subscribe to our newsletter, or contact us. This may include your name, email address, and any other information you choose to provide.</p>
          </section>

          <section>
            <h2 className="text-2xl font-semibold mb-4 text-[var(--gray-200)]">2. How We Use Your Information</h2>
            <p>We use the information we collect to:</p>
            <ul className="list-disc pl-6 space-y-2">
              <li>Provide, maintain, and improve our services</li>
              <li>Send you newsletters and updates about AI tools</li>
              <li>Respond to your comments and questions</li>
              <li>Analyze usage patterns to enhance user experience</li>
            </ul>
          </section>

          <section>
            <h2 className="text-2xl font-semibold mb-4 text-[var(--gray-200)]">3. Information Sharing</h2>
            <p>We do not sell, trade, or otherwise transfer your personal information to third parties without your consent, except as described in this policy or as required by law.</p>
          </section>

          <section>
            <h2 className="text-2xl font-semibold mb-4 text-[var(--gray-200)]">4. Data Security</h2>
            <p>We implement appropriate security measures to protect your personal information against unauthorized access, alteration, disclosure, or destruction.</p>
          </section>

          <section>
            <h2 className="text-2xl font-semibold mb-4 text-[var(--gray-200)]">5. Cookies and Analytics</h2>
            <p>We use cookies and similar technologies to enhance your browsing experience and analyze website traffic. We use Google Analytics to understand how visitors interact with our site.</p>
          </section>

          <section>
            <h2 className="text-2xl font-semibold mb-4 text-[var(--gray-200)]">6. Your Rights</h2>
            <p>You have the right to access, update, or delete your personal information. You may also opt out of receiving promotional communications from us at any time.</p>
          </section>

          <section>
            <h2 className="text-2xl font-semibold mb-4 text-[var(--gray-200)]">7. Changes to This Policy</h2>
            <p>We may update this privacy policy from time to time. We will notify you of any changes by posting the new policy on this page and updating the effective date.</p>
          </section>

          <section>
            <h2 className="text-2xl font-semibold mb-4 text-[var(--gray-200)]">8. Contact Us</h2>
            <p>If you have any questions about this privacy policy, please contact us through our social media channels or website contact form.</p>
          </section>
        </div>
      </div>
      <Footer />
    </div>
  );
}