'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { addTool, getAllTools, deleteTool, updateTool, bulkImportTools } from '@/lib/actions/tools';
import { Tool } from '@/types';
import { showSuccess, showError } from '@/lib/utils/sweetAlert';

export default function AdminPage() {
  const [tools, setTools] = useState<Tool[]>([]);
  const [loading, setLoading] = useState(false);
  const [editingTool, setEditingTool] = useState<Tool | null>(null);
  const [activeTab, setActiveTab] = useState<'single' | 'bulk'>('single');
  const [bulkLoading, setBulkLoading] = useState(false);
  const [formData, setFormData] = useState({
    name: '',
    description: '',
    short_description: '',
    categories: [] as number[],
    website: '',
    logo_url: '',
    pricing_models: [] as string[],
    pricing_from: '',
    free_trial_days: '',
    tags: '',
    video_demo_url: '',
    use_cases: '',
    features: '',
    startup_benefits: ''
  });



  useEffect(() => {
    loadTools();
  }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    
    try {
      const processedData = {
        ...formData,
        pricing_from: formData.pricing_from ? parseFloat(formData.pricing_from) : undefined,
        free_trial_days: formData.free_trial_days ? parseInt(formData.free_trial_days) : undefined,
        tags: formData.tags ? formData.tags.split(',').map(tag => tag.trim()) : [],
        use_cases: formData.use_cases ? formData.use_cases.split(',').map(uc => uc.trim()) : [],
        features: formData.features ? formData.features.split(',').map(f => f.trim()) : []
      };
      
      let result;
      if (editingTool) {
        result = await updateTool(editingTool.slug, processedData);
      } else {
        result = await addTool(processedData);
      }
      
      if (result.success) {
        await showSuccess('Success!', editingTool ? 'Tool updated successfully!' : 'Tool added successfully!');
        resetForm();
        loadTools();
      } else {
        const errorMsg = (result as any).error?.message || 'Failed to save tool';
        await showError('Error', errorMsg);
      }
    } catch (error: any) {
      const errorMsg = error?.message || 'An error occurred';
      await showError('Error', errorMsg);
    } finally {
      setLoading(false);
    }
  };

  const resetForm = () => {
    setFormData({
      name: '',
      description: '',
      short_description: '',
      categories: [],
      website: '',
      logo_url: '',
      pricing_models: [],
      pricing_from: '',
      free_trial_days: '',
      tags: '',
      video_demo_url: '',
      use_cases: '',
      features: '',
      startup_benefits: ''
    });
    setEditingTool(null);
  };

  const loadTools = async () => {
    const allTools = await getAllTools();
    setTools(Array.isArray(allTools) ? allTools : []);
  };

  const handleEdit = (tool: Tool) => {
    setEditingTool(tool);
    setFormData({
      name: tool.name,
      description: tool.description,
      short_description: tool.short_description || '',
      categories: tool.categories?.map(c => c.id) || [],
      website: tool.website || '',
      logo_url: tool.logo_url || '',
      pricing_models: tool.pricing_models || [],
      pricing_from: tool.pricing_from?.toString() || '',
      free_trial_days: tool.free_trial_days?.toString() || '',
      tags: tool.tags?.join(', ') || '',
      video_demo_url: tool.video_demo_url || '',
      use_cases: tool.use_cases?.join(', ') || '',
      features: tool.features?.join(', ') || '',
      startup_benefits: tool.startup_benefits || ''
    });
    setActiveTab('single');
  };

  const handleDelete = async (slug: string) => {
    if (confirm('Are you sure you want to delete this tool?')) {
      const result = await deleteTool(slug);
      if (result.success) {
        await showSuccess('Success!', 'Tool deleted successfully!');
        loadTools();
      } else {
        await showError('Error', 'Failed to delete tool.');
      }
    }
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  const handleBulkUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setBulkLoading(true);
    try {
      const text = await file.text();
      const lines = text.split('\n');
      const headers = lines[0].split(',').map(h => h.trim());
      
      const tools = lines.slice(1)
        .filter(line => line.trim())
        .map(line => {
          const values = line.split(',').map(v => v.trim());
          const tool: any = {};
          headers.forEach((header, index) => {
            tool[header] = values[index] || '';
          });
          return tool;
        });

      const result = await bulkImportTools(tools);
      if (result.success) {
        await showSuccess('Success!', `Imported ${result.added} out of ${result.total} tools successfully!`);
        loadTools();
      } else {
        await showError('Error', 'Failed to import tools. Please check the format.');
      }
    } catch (error) {
      await showError('Error', 'Failed to process file. Please check the format.');
    } finally {
      setBulkLoading(false);
      e.target.value = '';
    }
  };

  const downloadTemplate = () => {
    const headers = ['name', 'description', 'short_description', 'website', 'logo_url', 'pricing_from', 'free_trial_days', 'tags', 'use_cases', 'features'];
    const sampleData = [
      'ChatGPT,AI-powered conversational assistant,Chat with AI,https://chat.openai.com,https://example.com/image.jpg,20,7,"conversational AI, content creation","content writing, customer support","AI chat, context awareness"',
      'Figma,Design collaboration platform,Collaborative design tool,https://figma.com,https://example.com/figma.jpg,12,14,"design, collaboration","UI/UX design, prototyping","real-time collaboration, vector editing"'
    ];
    
    const csv = [headers.join(','), ...sampleData].join('\n');
    const blob = new Blob([csv], { type: 'text/csv' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'tools_template.csv';
    a.click();
    URL.revokeObjectURL(url);
  };

  return (
    <div className="min-h-screen bg-[var(--gray-black)]">
      {/* Navigation */}
      <nav className="px-6 py-4 bg-[var(--gray-black)] border-b border-[var(--gray-800)]">
        <div className="max-w-7xl mx-auto flex justify-between items-center">
          <Link href="/" className="flex items-center">
            <img src="/logo-light.png" alt="ONE9FOUNDERS" className="h-8" draggable={false} />
          </Link>
          <Link href="/" className="text-[var(--gray-400)] hover:text-white">
            ← Back to Home
          </Link>
        </div>
      </nav>

      <div className="max-w-7xl mx-auto px-6 py-12">
        <h1 className="text-4xl font-bold text-white mb-8">Admin Dashboard</h1>
        
        {/* Tabs */}
        <div className="flex mb-8">
          <button
            onClick={() => setActiveTab('single')}
            className={`px-6 py-3 rounded-t-lg font-medium transition-colors ${
              activeTab === 'single' 
                ? 'bg-purple-600 text-white' 
                : 'bg-[var(--gray-800)] text-[var(--gray-300)] hover:bg-[var(--gray-700)]'
            }`}
          >
            Single Tool
          </button>
          <button
            onClick={() => setActiveTab('bulk')}
            className={`px-6 py-3 rounded-t-lg font-medium transition-colors ${
              activeTab === 'bulk' 
                ? 'bg-purple-600 text-white' 
                : 'bg-[var(--gray-800)] text-[var(--gray-300)] hover:bg-[var(--gray-700)]'
            }`}
          >
            Bulk Upload
          </button>
        </div>

        {/* Single Tool Form */}
        {activeTab === 'single' && (
          <div className="rounded-lg p-8 mb-8 bg-[var(--gray-900)] border border-[var(--gray-800)]">
            <h2 className="text-2xl font-semibold text-white mb-6">
              {editingTool ? 'Edit Tool' : 'Add New Tool'}
            </h2>
            <form onSubmit={handleSubmit} className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label className="block text-sm font-medium text-white mb-2">Tool Name *</label>
                  <input
                    type="text"
                    name="name"
                    value={formData.name}
                    onChange={handleChange}
                    className="w-full px-4 py-3 rounded-lg focus:outline-none focus:border-purple-500 transition-colors bg-[var(--gray-800)] border border-[var(--gray-700)] text-white"
                    required
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-white mb-2">Short Description</label>
                  <input
                    type="text"
                    name="short_description"
                    value={formData.short_description}
                    onChange={handleChange}
                    maxLength={200}
                    className="w-full px-4 py-3 rounded-lg focus:outline-none focus:border-purple-500 transition-colors bg-[var(--gray-800)] border border-[var(--gray-700)] text-white"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-white mb-2">Website URL</label>
                  <input
                    type="url"
                    name="website"
                    value={formData.website}
                    onChange={handleChange}
                    className="w-full px-4 py-3 rounded-lg focus:outline-none focus:border-purple-500 transition-colors bg-[var(--gray-800)] border border-[var(--gray-700)] text-white"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-white mb-2">Logo URL</label>
                  <input
                    type="url"
                    name="logo_url"
                    value={formData.logo_url}
                    onChange={handleChange}
                    className="w-full px-4 py-3 rounded-lg focus:outline-none focus:border-purple-500 transition-colors bg-[var(--gray-800)] border border-[var(--gray-700)] text-white"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-white mb-2">Starting Price ($)</label>
                  <input
                    type="number"
                    name="pricing_from"
                    value={formData.pricing_from}
                    onChange={handleChange}
                    className="w-full px-4 py-3 rounded-lg focus:outline-none focus:border-purple-500 transition-colors bg-[var(--gray-800)] border border-[var(--gray-700)] text-white"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-white mb-2">Free Trial Days</label>
                  <input
                    type="number"
                    name="free_trial_days"
                    value={formData.free_trial_days}
                    onChange={handleChange}
                    className="w-full px-4 py-3 rounded-lg focus:outline-none focus:border-purple-500 transition-colors bg-[var(--gray-800)] border border-[var(--gray-700)] text-white"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-white mb-2">Video Demo URL</label>
                  <input
                    type="url"
                    name="video_demo_url"
                    value={formData.video_demo_url}
                    onChange={handleChange}
                    className="w-full px-4 py-3 rounded-lg focus:outline-none focus:border-purple-500 transition-colors bg-[var(--gray-800)] border border-[var(--gray-700)] text-white"
                  />
                </div>
              </div>
              
              <div>
                <label className="block text-sm font-medium text-white mb-2">Description *</label>
                <textarea
                  name="description"
                  value={formData.description}
                  onChange={handleChange}
                  rows={4}
                  className="w-full px-4 py-3 rounded-lg focus:outline-none focus:border-purple-500 transition-colors resize-vertical bg-[var(--gray-800)] border border-[var(--gray-700)] text-white"
                  required
                />
              </div>
              
              <div>
                <label className="block text-sm font-medium text-white mb-2">Tags (comma-separated)</label>
                <input
                  type="text"
                  name="tags"
                  value={formData.tags}
                  onChange={handleChange}
                  placeholder="e.g., AI, productivity, automation"
                  className="w-full px-4 py-3 rounded-lg focus:outline-none focus:border-purple-500 transition-colors bg-[var(--gray-800)] border border-[var(--gray-700)] text-white"
                />
              </div>
              
              <div>
                <label className="block text-sm font-medium text-white mb-2">Use Cases (comma-separated)</label>
                <input
                  type="text"
                  name="use_cases"
                  value={formData.use_cases}
                  onChange={handleChange}
                  placeholder="e.g., content creation, customer support, data analysis"
                  className="w-full px-4 py-3 rounded-lg focus:outline-none focus:border-purple-500 transition-colors bg-[var(--gray-800)] border border-[var(--gray-700)] text-white"
                />
              </div>
              
              <div>
                <label className="block text-sm font-medium text-white mb-2">Features (comma-separated)</label>
                <input
                  type="text"
                  name="features"
                  value={formData.features}
                  onChange={handleChange}
                  placeholder="e.g., AI-powered, Real-time collaboration"
                  className="w-full px-4 py-3 rounded-lg focus:outline-none focus:border-purple-500 transition-colors bg-[var(--gray-800)] border border-[var(--gray-700)] text-white"
                />
              </div>
              
              <div>
                <label className="block text-sm font-medium text-white mb-2">Startup Benefits</label>
                <textarea
                  name="startup_benefits"
                  value={formData.startup_benefits}
                  onChange={handleChange}
                  rows={3}
                  placeholder="How this tool helps startups/founders"
                  className="w-full px-4 py-3 rounded-lg focus:outline-none focus:border-purple-500 transition-colors resize-vertical bg-[var(--gray-800)] border border-[var(--gray-700)] text-white"
                />
              </div>

              <div className="flex gap-4">
                <button
                  type="submit"
                  disabled={loading}
                  className="flex-1 py-3 px-6 bg-purple-600 text-white rounded-lg hover:bg-purple-700 disabled:opacity-50 font-medium transition-colors"
                >
                  {loading ? (editingTool ? 'Updating...' : 'Adding...') : (editingTool ? 'Update Tool' : 'Add Tool')}
                </button>
                {editingTool && (
                  <button
                    type="button"
                    onClick={resetForm}
                    className="px-6 py-3 bg-[var(--gray-600)] text-white rounded-lg hover:bg-[var(--gray-700)] font-medium transition-colors"
                  >
                    Cancel
                  </button>
                )}
              </div>
            </form>
          </div>
        )}

        {/* Bulk Upload */}
        {activeTab === 'bulk' && (
          <div className="rounded-lg p-8 mb-8 bg-[var(--gray-900)] border border-[var(--gray-800)]">
            <h2 className="text-2xl font-semibold text-white mb-6">Bulk Upload Tools</h2>
            
            <div className="space-y-6">
              <div className="p-4 rounded-lg bg-[var(--gray-800)]">
                <h3 className="text-lg font-medium text-white mb-3">Instructions</h3>
                <ul className="text-[var(--gray-300)] space-y-2 text-sm">
                  <li>• Upload a CSV file with tool data</li>
                  <li>• Required columns: name, description</li>
                  <li>• Optional columns: short_description, website, logo_url, pricing_from, free_trial_days, tags, use_cases, features</li>
                  <li>• Use comma-separated values for tags, use_cases, and features</li>
                  <li>• Download the template below for the correct format</li>
                </ul>
              </div>
              
              <div className="flex gap-4">
                <button
                  onClick={downloadTemplate}
                  className="btn-primary px-6 py-3 font-medium"
                >
                  Download Template
                </button>
                
                <label className="px-6 py-3 bg-purple-600 text-white rounded-lg hover:bg-purple-700 font-medium transition-colors cursor-pointer">
                  {bulkLoading ? 'Uploading...' : 'Upload CSV File'}
                  <input
                    type="file"
                    accept=".csv"
                    onChange={handleBulkUpload}
                    disabled={bulkLoading}
                    className="hidden"
                  />
                </label>
              </div>
            </div>
          </div>
        )}

        {/* Tools List */}
        <div className="rounded-lg p-8 bg-[var(--gray-900)] border border-[var(--gray-800)]">
          <div className="flex justify-between items-center mb-6">
            <h2 className="text-2xl font-semibold text-white">All Tools ({Array.isArray(tools) ? tools.length : 0})</h2>
            <button
              onClick={loadTools}
              className="px-6 py-3 bg-green-600 text-white rounded-lg hover:bg-green-700 font-medium transition-colors"
            >
              Refresh
            </button>
          </div>
          
          <div className="grid gap-4">
            {Array.isArray(tools) && tools.map((tool) => (
              <div key={tool.id} className="p-6 rounded-lg flex justify-between items-start bg-[var(--gray-800)]">
                <div className="flex-1">
                  <div className="flex items-center gap-3 mb-2">
                    <h3 className="text-xl font-semibold text-white">{tool.name}</h3>
                    {tool.is_featured && (
                      <span className="px-2 py-1 text-xs rounded-full bg-yellow-500 text-black font-medium">
                        Featured
                      </span>
                    )}
                    {tool.verified && (
                      <span className="px-2 py-1 text-xs rounded-full text-white font-medium bg-[var(--brand-primary)]">
                        Verified
                      </span>
                    )}
                    {tool.startup_friendly && (
                      <span className="px-2 py-1 text-xs rounded-full bg-green-500 text-white font-medium">
                        Startup Friendly
                      </span>
                    )}
                  </div>
                  <p className="text-purple-400 text-sm mb-2">{tool.categories?.map(c => c.name).join(', ') || 'Uncategorized'}</p>
                  <p className="text-[var(--gray-300)] text-sm mb-3">{tool.description?.substring(0, 150) || 'No description'}...</p>
                  <div className="flex items-center gap-4 text-xs text-[var(--gray-400)]">
                    {tool.pricing_models && tool.pricing_models.length > 0 && (
                      <span>Pricing: {tool.pricing_models.join(', ')}</span>
                    )}
                    {tool.rating > 0 && (
                      <span>Rating: {tool.rating}/5 ({tool.review_count} reviews)</span>
                    )}
                    {tool.tags && tool.tags.length > 0 && (
                      <span>Tags: {tool.tags.slice(0, 3).join(', ')}</span>
                    )}
                  </div>
                </div>
                <div className="flex gap-2 ml-4">
                  <button
                    onClick={() => handleEdit(tool)}
                    className="btn-primary px-4 py-2 text-sm font-medium"
                  >
                    Edit
                  </button>
                  <button
                    onClick={() => handleDelete(tool.slug)}
                    className="px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 text-sm font-medium transition-colors"
                  >
                    Delete
                  </button>
                </div>
              </div>
            ))}
          </div>
          
          {(!Array.isArray(tools) || tools.length === 0) && (
            <div className="text-center text-[var(--gray-400)] py-12">
              No tools found. Add some tools to get started.
            </div>
          )}
        </div>
      </div>
    </div>
  );
}