import { Metadata } from 'next';
import { generateSEO, generateStructuredData } from '@/lib/utils/seo';
import Link from 'next/link';
import Navbar from '@/components/layout/Navbar';
import Footer from '@/components/layout/Footer';
import ContactCard from '@/components/ui/ContactCard';

export const metadata: Metadata = generateSEO({
  title: 'About Us - India\'s Security-First AI Tools Directory',
  description: 'Meet the One9Founders team building India\'s first security-validated AI tools directory. IIT Bombay-backed, serving global and Indian founders with unbiased tool reviews.',
  path: '/about',
  keywords: ['about one9founders', 'Indian startup team', 'AI tool directory India', 'IIT Bombay startup', 'founder resources India', 'AI tools for Indian startups'],
});

export default function AboutPage() {
  return (
    <div className="min-h-screen bg-[var(--gray-black)]">
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify(
            generateStructuredData({
              '@type': 'Organization',
              name: 'One9Founders',
              url: 'https://one9founders.com',
              logo: 'https://one9founders.com/logo-light.png',
              description: 'India\'s first security-validated AI tools directory for global and Indian startup founders',
              foundingDate: '2024',
              areaServed: ['India', 'Global'],
              knowsAbout: ['AI Tools', 'Startup Technology', 'Security Assessment', 'Tool Evaluation'],
              founders: [
                { '@type': 'Person', name: 'Amit Bhartiya', jobTitle: 'CEO' },
                { '@type': 'Person', name: 'Arnav Gautam', jobTitle: 'CTO' },
                { '@type': 'Person', name: 'Dinesh Sahu', jobTitle: 'CTO' },
                { '@type': 'Person', name: 'Shreya Nair', jobTitle: 'CMO' },
              ],
              contactPoint: {
                '@type': 'ContactPoint',
                email: 'amitbhartiya.o9f@gmail.com',
                contactType: 'Customer Service',
              },
            })
          ),
        }}
      />
      <Navbar />

      {/* Hero Section */}
      <section className="py-20 px-6">
        <div className="max-w-4xl mx-auto text-center">
          <h1 className="text-5xl font-bold text-white mb-6">
            About One9Founders
          </h1>
          <p className="text-xl text-[var(--gray-300)] mb-6">
            India&apos;s first security-validated AI tools directory for global and Indian founders
          </p>
          <div className="flex items-center justify-center gap-4 text-sm text-[var(--gray-400)]">
            <span className="flex items-center gap-2">
              <svg className="w-5 h-5 text-green-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
              </svg>
              2,500+ Tools Tested
            </span>
            <span className="flex items-center gap-2">
              <svg className="w-5 h-5 text-purple-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" />
              </svg>
              IIT Bombay Backed
            </span>
            <span className="flex items-center gap-2">
              <svg className="w-5 h-5 text-blue-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3.055 11H5a2 2 0 012 2v1a2 2 0 002 2 2 2 0 012 2v2.945M8 3.935V5.5A2.5 2.5 0 0010.5 8h.5a2 2 0 012 2 2 2 0 104 0 2 2 0 012-2h1.064M15 20.488V18a2 2 0 012-2h3.064M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
              Serving Global Founders
            </span>
          </div>
        </div>
      </section>

      {/* Mission Section */}
      <section className="py-16 px-6">
        <div className="max-w-6xl mx-auto">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
            <div>
              <h2 className="text-3xl font-bold text-white mb-6">Our Mission</h2>
              <p className="text-[var(--gray-300)] mb-6">
                In today&apos;s rapidly evolving AI landscape, founders and entrepreneurs across India and globally face an overwhelming number of tools and platforms. 
                One9Founders was created to solve this challenge by providing intelligent, security-first tool discovery that helps you 
                find the right AI tools for your specific needs.
              </p>
              <p className="text-[var(--gray-300)] mb-6">
                We believe that the right tools can accelerate your startup&apos;s growth, streamline workflows, and unlock new possibilities. 
                Our platform cuts through the noise to deliver curated, security-validated recommendations tailored to your business requirements.
              </p>
              <p className="text-[var(--gray-300)]">
                Whether you&apos;re a first-time founder in Bangalore, a serial entrepreneur in Mumbai, or building your startup anywhere in the world, 
                One9Founders helps you make informed decisions about the AI tools that power your business.
              </p>
            </div>
            <div className="flex justify-center">
              <img 
                src="https://4cqs2zpl07.ucarecd.net/7819e4cc-3392-4e93-8eef-4ba21a87dfc0/-/preview/" 
                alt="AI Technology" 
                className="rounded-lg shadow-lg"
              />
            </div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-16 px-6 bg-[var(--gray-900)]">
        <div className="max-w-6xl mx-auto">
          <h2 className="text-3xl font-bold text-white text-center mb-12">Why Choose One9Founders?</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="text-center">
              <div className="w-16 h-16 mx-auto mb-4 rounded-full flex items-center justify-center bg-[var(--brand-primary)]">
                <svg className="w-8 h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                </svg>
              </div>
              <h3 className="text-xl font-bold text-white mb-3">Intelligent Search</h3>
              <p className="text-[var(--gray-400)]">
                Natural language search powered by advanced AI embeddings. Find tools by describing what you need, not just keywords.
              </p>
            </div>
            <div className="text-center">
              <div className="w-16 h-16 mx-auto mb-4 rounded-full flex items-center justify-center bg-[var(--brand-primary)]">
                <svg className="w-8 h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
              </div>
              <h3 className="text-xl font-bold text-white mb-3">Curated Quality</h3>
              <p className="text-[var(--gray-400)]">
                Hand-selected AI tools with verified information. Every tool in our directory is evaluated for quality and relevance.
              </p>
            </div>
            <div className="text-center">
              <div className="w-16 h-16 mx-auto mb-4 rounded-full flex items-center justify-center bg-[var(--brand-primary)]">
                <svg className="w-8 h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
                </svg>
              </div>
              <h3 className="text-xl font-bold text-white mb-3">Founder-Focused</h3>
              <p className="text-[var(--gray-400)]">
                Built specifically for startup founders and entrepreneurs. Tools are categorized and described with business impact in mind.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Editorial Guidelines Section - E-E-A-T */}
      <section className="py-16 px-6">
        <div className="max-w-6xl mx-auto">
          <h2 className="text-3xl font-bold text-white text-center mb-4">Our Editorial Standards</h2>
          <p className="text-[var(--gray-400)] text-center mb-12 max-w-3xl mx-auto">
            Transparency and trust are at the core of everything we do. Here&apos;s how we ensure the quality and integrity of our AI tool reviews.
          </p>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            <div className="bg-[var(--gray-900)] rounded-xl p-6 border border-[var(--gray-700)]">
              <h3 className="text-xl font-bold text-white mb-4 flex items-center gap-3">
                <svg className="w-6 h-6 text-green-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
                </svg>
                Security-First Evaluation
              </h3>
              <p className="text-[var(--gray-300)]">
                Every tool undergoes our 10-point security assessment before being listed. We evaluate data privacy, encryption standards, 
                compliance certifications, and third-party data sharing practices. Security is weighted at 20% of our total score.
              </p>
            </div>
            
            <div className="bg-[var(--gray-900)] rounded-xl p-6 border border-[var(--gray-700)]">
              <h3 className="text-xl font-bold text-white mb-4 flex items-center gap-3">
                <svg className="w-6 h-6 text-purple-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
                Zero Affiliate Bias
              </h3>
              <p className="text-[var(--gray-300)]">
                We do not accept affiliate commissions from any tool in our directory. Our revenue comes from optional premium listings 
                and enterprise partnerships - never from influencing which tools rank higher. When we recommend a tool, it&apos;s because it genuinely scored well.
              </p>
            </div>
            
            <div className="bg-[var(--gray-900)] rounded-xl p-6 border border-[var(--gray-700)]">
              <h3 className="text-xl font-bold text-white mb-4 flex items-center gap-3">
                <svg className="w-6 h-6 text-blue-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2m-6 9l2 2 4-4" />
                </svg>
                Uniform Rating Criteria
              </h3>
              <p className="text-[var(--gray-300)]">
                Every tool is evaluated using the same 10-point framework, ensuring fair comparisons across categories. 
                Our criteria cover security, functionality, ease of use, pricing, reliability, integrations, support, stability, updates, and startup-friendliness.
              </p>
            </div>
            
            <div className="bg-[var(--gray-900)] rounded-xl p-6 border border-[var(--gray-700)]">
              <h3 className="text-xl font-bold text-white mb-4 flex items-center gap-3">
                <svg className="w-6 h-6 text-yellow-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
                </svg>
                Regular Re-Evaluation
              </h3>
              <p className="text-[var(--gray-300)]">
                Tools are re-evaluated quarterly and immediately after major updates or security incidents. 
                We monitor user feedback, industry news, and tool changes to keep our ratings current and accurate.
              </p>
            </div>
          </div>
          
          <div className="text-center mt-8">
            <Link 
              href="/methodology" 
              className="inline-flex items-center gap-2 text-purple-400 hover:text-purple-300 font-medium"
            >
              Read our full methodology
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
              </svg>
            </Link>
          </div>
        </div>
      </section>

      {/* Team Section */}
      <section className="py-16 px-6">
  <div className="max-w-6xl mx-auto">
    <h2 className="text-3xl font-bold text-white text-center mb-12">Meet Our Team</h2>
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
      <ContactCard
        picture="https://4cqs2zpl07.ucarecd.net/fe69a771-5074-4a28-9bda-c17e8c526ac9/-/preview/"
        name="Amit Bhartiya"
        designation="CEO"
        email="amitbhartiya.o9f@gmail.com"
        linkedin="https://www.linkedin.com/in/amitbhartiya33/"
        phone="+917878469798"
      />
      <ContactCard
        picture="https://4cqs2zpl07.ucarecd.net/906fa9be-5977-43d5-983c-fa4454db2547/-/preview/"
        name="Arnav Gautam"
        designation="CTO"
        email="arnav.o9f@gmail.com"
        linkedin="https://www.linkedin.com/in/arnav-gautam-570553289/"
        phone="+919414454858"
      />
      <ContactCard
        picture="https://4cqs2zpl07.ucarecd.net/4cc6cdfd-0552-4b72-87d6-e2f0d8b053d0/-/preview/"
        name="Dinesh Sahu"
        designation="CTO"
        email="dineshsahu.o9f@gmail.com"
        linkedin="https://www.linkedin.com/in/xdineshsahu/"
        phone="+918109286424"
      />
      <ContactCard
        picture="https://4cqs2zpl07.ucarecd.net/c4257977-8c69-4a93-bb5a-412dbe412590/-/preview/"
        name="Shreya Nair"
        designation="CMO" 
        email="shreyaa.o9f@gmail.com"
        linkedin="https://www.linkedin.com/in/shreya-nair-79597227b/"
        phone="+919082332410"
      />
    </div>
  </div>
</section>

      {/* Mentor Section */}
      <section className="py-16 px-6">
        <div className="max-w-6xl mx-auto">
          <h2 className="text-3xl font-bold text-white text-center mb-12">Our Mentor</h2>
          <div className="max-w-4xl mx-auto">
            <div className="rounded-3xl p-8 bg-[var(--gray-900)]">
              <div className="flex flex-col lg:flex-row items-center gap-8">
                <div className="flex-shrink-0">
                  <img
                    src="https://i1.rgstatic.net/ii/profile.image/11431281220749348-1706592251827_Q512/Ramesh-Kuruva.jpg"
                    alt="Dr. Ramesh Kuruva"
                    className="w-72 h-72 rounded-3xl object-cover"
                  />
                </div>
                <div className="flex-1 text-center lg:text-left">
                  <h3 className="text-2xl font-bold text-white mb-2">Dr. Ramesh Kuruva</h3>
                  <p className="text-brand-primary mb-4">Assistant Professor, Desai Sethi School of Entrepreneurship, IIT Bombay</p>
                  <div className="bg-[var(--gray-700)] p-4 rounded-lg mb-4">
                    <p className="text-[var(--gray-300)] italic">
                      "One9Founders represents an innovative approach to AI tool discovery. Their platform demonstrates 
                      the kind of entrepreneurial thinking and technological innovation that we aim to foster in the startup ecosystem. 
                      I'm excited to mentor this team as they work to empower founders with better AI tool discovery solutions."
                    </p>
                  </div>
                  <div className="text-sm text-[var(--gray-400)] space-y-1">
                    <p>• PhD in Entrepreneurial Finance from IIT Madras</p>
                    <p>• Co-founder & Former CEO of YNOS Venture Engine</p>
                    <p>• Gold medalist in Bachelor's and Master's in Accounting and Finance</p>
                    <p>• Key contributor to India Venture Capital and Private Equity Reports</p>
                    <p>• Established Centre for Research on Startups (CREST) at IIT Madras</p>
                    <p>• Expert in Venture Capital, Entrepreneurship & Startup Ecosystems</p>
                    <p>• Collaborated with multiple government ministries on startup initiatives</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Footer */}
      <Footer />
    </div>
  );
}
