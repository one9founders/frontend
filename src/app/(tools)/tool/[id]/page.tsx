import { toolsAPI } from '@/lib/api/apiClient';
import { notFound } from 'next/navigation';
import Link from 'next/link';

export default async function ToolPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const tool = await toolsAPI.getBySlug(id);
  
  if (!tool) {
    notFound();
  }

  return (
    <div className="min-h-screen bg-gray-black">
      <nav className="p-4 border-b border-gray-800">
        <Link href="/" className="hover:opacity-80" style={{ color: 'var(--brand-light)' }}>
          ← Back to Directory
        </Link>
      </nav>
      
      <div className="max-w-4xl mx-auto p-8">
        <div className="bg-gray-900 rounded-lg p-8">
          <div className="flex flex-col md:flex-row gap-8">
            <img
              src={tool.logo_url || '/logo.svg'}
              alt={tool.name}
              className="w-full md:w-64 h-48 object-cover rounded-lg"
            />
            
            <div className="flex-1">
              <div className="flex items-center gap-4 mb-4">
                <h1 className="text-4xl font-bold text-white">{tool.name}</h1>
                {tool.verified && (
                  <span className="bg-green-600 text-white px-2 py-1 rounded text-sm">
                    Verified
                  </span>
                )}
                {tool.is_featured && (
                  <span className="bg-purple-600 text-white px-2 py-1 rounded text-sm">
                    Featured
                  </span>
                )}
                {tool.startup_friendly && (
                  <span className="bg-green-600 text-white px-2 py-1 rounded text-sm">
                    Startup Friendly
                  </span>
                )}
              </div>
              
              <p className="text-gray-300 text-lg mb-6">{tool.description}</p>
              
              <div className="grid grid-cols-2 gap-4 mb-6">
                <div>
                  <span className="text-gray-400">Categories:</span>
                  <span className="text-white ml-2">
                    {tool.categories?.map((c: any) => c.name).join(', ') || 'N/A'}
                  </span>
                </div>
                <div>
                  <span className="text-gray-400">Rating:</span>
                  <span className="text-yellow-400 ml-2">
                    ★ {tool.rating} ({tool.review_count} reviews)
                  </span>
                </div>
                {tool.pricing_models?.length > 0 && (
                  <div>
                    <span className="text-gray-400">Pricing:</span>
                    <span className="text-white ml-2">
                      {tool.pricing_models.join(', ')}
                      {tool.pricing_from && ` from $${tool.pricing_from}`}
                    </span>
                  </div>
                )}
                {tool.free_trial_days && (
                  <div>
                    <span className="text-gray-400">Free Trial:</span>
                    <span className="text-green-400 ml-2">{tool.free_trial_days} days</span>
                  </div>
                )}
              </div>
              
              <a
                href={tool.affiliate_url || tool.website}
                target="_blank"
                rel="noopener noreferrer"
                className="btn-primary inline-block px-8 py-3 font-semibold"
              >
                Visit {tool.name}
              </a>
            </div>
          </div>
          
          {tool.tags && tool.tags.length > 0 && (
            <div className="mt-8">
              <h3 className="text-xl font-semibold text-white mb-4">Tags</h3>
              <div className="flex flex-wrap gap-2">
                {tool.tags.map((tag: string, index: number) => (
                  <span
                    key={index}
                    className="bg-gray-800 text-gray-300 px-3 py-1 rounded-full text-sm"
                  >
                    {tag}
                  </span>
                ))}
              </div>
            </div>
          )}
          
          {tool.use_cases && tool.use_cases.length > 0 && (
            <div className="mt-8">
              <h3 className="text-xl font-semibold text-white mb-4">Use Cases</h3>
              <ul className="list-disc list-inside text-gray-300 space-y-2">
                {tool.use_cases.map((useCase: string, index: number) => (
                  <li key={index}>{useCase}</li>
                ))}
              </ul>
            </div>
          )}
          
          {tool.features && tool.features.length > 0 && (
            <div className="mt-8">
              <h3 className="text-xl font-semibold text-white mb-4">Features</h3>
              <ul className="list-disc list-inside text-gray-300 space-y-2">
                {tool.features.map((feature: string, index: number) => (
                  <li key={index}>{feature}</li>
                ))}
              </ul>
            </div>
          )}
          
          {tool.startup_benefits && (
            <div className="mt-8">
              <h3 className="text-xl font-semibold text-white mb-4">Startup Benefits</h3>
              <p className="text-gray-300">{tool.startup_benefits}</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}