import Navbar from "../../components/layout/Navbar";
import Footer from "../../components/layout/Footer";

export default function TermsOfService() {
  return (
    <div className="min-h-screen bg-[var(--gray-black)]">
      <Navbar />
      <div className="max-w-4xl mx-auto px-6 py-16">
        <h1 className="text-4xl font-bold mb-8 text-[var(--gray-200)]">Terms of Service</h1>
        <div className="prose prose-invert max-w-none text-[var(--gray-400)] space-y-6">
          <p className="text-lg">
            <strong>Effective Date:</strong> January 1, 2026
          </p>
          
          <section>
            <h2 className="text-2xl font-semibold mb-4 text-[var(--gray-200)]">1. Acceptance of Terms</h2>
            <p>By accessing and using One9Founders, you accept and agree to be bound by the terms and provision of this agreement. If you do not agree to abide by the above, please do not use this service.</p>
          </section>

          <section>
            <h2 className="text-2xl font-semibold mb-4 text-[var(--gray-200)]">2. Description of Service</h2>
            <p>One9Founders is a platform that helps founders and startups discover, compare, and choose AI tools. We provide information, reviews, and comparisons of various AI tools and services.</p>
          </section>

          <section>
            <h2 className="text-2xl font-semibold mb-4 text-[var(--gray-200)]">3. User Responsibilities</h2>
            <p>You agree to:</p>
            <ul className="list-disc pl-6 space-y-2">
              <li>Use the service only for lawful purposes</li>
              <li>Not attempt to gain unauthorized access to our systems</li>
              <li>Not interfere with or disrupt the service</li>
              <li>Provide accurate information when creating accounts or submitting content</li>
            </ul>
          </section>

          <section>
            <h2 className="text-2xl font-semibold mb-4 text-[var(--gray-200)]">4. Content and Intellectual Property</h2>
            <p>All content on One9Founders, including text, graphics, logos, and software, is the property of One9Founders or its content suppliers and is protected by copyright and other intellectual property laws.</p>
          </section>

          <section>
            <h2 className="text-2xl font-semibold mb-4 text-[var(--gray-200)]">5. Disclaimer of Warranties</h2>
            <p>The information on this website is provided on an "as is" basis. We make no warranties, expressed or implied, and hereby disclaim all other warranties including implied warranties of merchantability, fitness for a particular purpose, or non-infringement.</p>
          </section>

          <section>
            <h2 className="text-2xl font-semibold mb-4 text-[var(--gray-200)]">6. Limitation of Liability</h2>
            <p>In no event shall One9Founders be liable for any damages including, without limitation, indirect or consequential damages, or any damages whatsoever arising from use or loss of use, data, or profits.</p>
          </section>

          <section>
            <h2 className="text-2xl font-semibold mb-4 text-[var(--gray-200)]">7. Third-Party Links</h2>
            <p>Our service may contain links to third-party websites or services. We are not responsible for the content, privacy policies, or practices of third-party websites.</p>
          </section>

          <section>
            <h2 className="text-2xl font-semibold mb-4 text-[var(--gray-200)]">8. Modifications</h2>
            <p>We reserve the right to modify these terms at any time. Changes will be effective immediately upon posting on the website.</p>
          </section>

          <section>
            <h2 className="text-2xl font-semibold mb-4 text-[var(--gray-200)]">9. Termination</h2>
            <p>We may terminate or suspend your access to our service immediately, without prior notice, for any reason whatsoever, including breach of these terms.</p>
          </section>

          <section>
            <h2 className="text-2xl font-semibold mb-4 text-[var(--gray-200)]">10. Contact Information</h2>
            <p>If you have any questions about these Terms of Service, please contact us through our social media channels or website contact form.</p>
          </section>
        </div>
      </div>
      <Footer />
    </div>
  );
}