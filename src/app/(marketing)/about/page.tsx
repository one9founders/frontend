import { Metadata } from 'next';
import { generateSEO, generateStructuredData } from '@/lib/utils/seo';
import Link from 'next/link';
import Navbar from '@/components/layout/Navbar';
import Footer from '@/components/layout/Footer';
import ContactCard from '@/components/ui/ContactCard';

export const metadata: Metadata = generateSEO({
  title: 'About Us - Meet the One9Founders Team',
  description: 'Learn about One9Founders mission to empower startup founders with intelligent AI tool discovery. Meet our team and mentor from IIT Bombay.',
  path: '/about',
  keywords: ['about one9founders', 'startup team', 'AI tool directory team', 'IIT Bombay', 'founder resources'],
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
              description: 'AI Tool Directory for Startups and Founders',
              foundingDate: '2024',
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
          <p className="text-xl text-[var(--gray-300)] mb-12">
            Empowering founders with intelligent AI tool discovery
          </p>
        </div>
      </section>

      {/* Mission Section */}
      <section className="py-16 px-6">
        <div className="max-w-6xl mx-auto">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
            <div>
              <h2 className="text-3xl font-bold text-white mb-6">Our Mission</h2>
              <p className="text-[var(--gray-300)] mb-6">
                In today's rapidly evolving AI landscape, founders and entrepreneurs face an overwhelming number of tools and platforms. 
                One9Founders was created to solve this challenge by providing intelligent, semantic search capabilities that help you 
                discover the right AI tools for your specific needs.
              </p>
              <p className="text-[var(--gray-300)]">
                We believe that the right tools can accelerate your startup's growth, streamline workflows, and unlock new possibilities. 
                Our platform cuts through the noise to deliver curated, relevant recommendations tailored to your business requirements.
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