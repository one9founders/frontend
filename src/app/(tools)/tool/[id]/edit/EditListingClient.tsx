'use client';

import { useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { updateOwnedListing } from '@/lib/actions/listings';
import { showError, showSuccess } from '@/lib/utils/sweetAlert';
import type { Tool } from '@/types';

function joinList(value?: string[]) {
  return (value || []).join(', ');
}

function splitList(value: string) {
  return value
    .split(',')
    .map((item) => item.trim())
    .filter(Boolean);
}

export default function EditListingClient({ tool }: { tool: Tool }) {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({
    name: tool.name || '',
    short_description: tool.short_description || '',
    description: tool.description || '',
    website: tool.website || '',
    logo_url: tool.logo_url || '',
    startup_benefits: tool.startup_benefits || '',
    features: joinList(tool.features),
    use_cases: joinList(tool.use_cases),
  });

  const handleChange = (
    event: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    setFormData({ ...formData, [event.target.name]: event.target.value });
  };

  const handleSubmit = async (event: React.FormEvent) => {
    event.preventDefault();
    if (!formData.name.trim() || !formData.description.trim()) {
      setLoading(false);
      await showError('Missing details', 'Name and description are required.');
      return;
    }
    setLoading(true);
    const result = await updateOwnedListing(tool.slug, {
      name: formData.name.trim(),
      short_description: formData.short_description.trim(),
      description: formData.description.trim(),
      website: formData.website.trim(),
      logo_url: formData.logo_url.trim(),
      startup_benefits: formData.startup_benefits.trim(),
      features: splitList(formData.features),
      use_cases: splitList(formData.use_cases),
    });
    setLoading(false);
    if (!result.success) {
      await showError('Could not save', result.error || 'Please try again.');
      return;
    }
    await showSuccess('Saved', 'Your listing has been updated.');
    router.push(`/tool/${tool.slug}`);
    router.refresh();
  };

  const fieldClass =
    'w-full px-4 py-3 rounded-lg focus:outline-none focus:border-copper transition-colors bg-[var(--gray-800)] border border-[var(--gray-700)] text-white';

  return (
    <section className="py-12 px-6">
      <div className="max-w-3xl mx-auto">
        <p className="text-sm text-[var(--gray-400)] mb-2">
          <Link href={`/tool/${tool.slug}`} className="hover:text-white">
            ← Back to listing
          </Link>
        </p>
        <h1 className="text-3xl font-bold text-white mb-2">Edit {tool.name}</h1>
        <p className="text-[var(--gray-400)] mb-8">
          You submitted this listing, so you can update the public name, description, and links.
        </p>
        <form onSubmit={handleSubmit} className="space-y-6 bg-[var(--gray-900)] rounded-lg p-6 md:p-8">
          <div>
            <label htmlFor="name" className="block text-sm font-medium text-white mb-2">
              Company / product name *
            </label>
            <input
              id="name"
              name="name"
              value={formData.name}
              onChange={handleChange}
              className={fieldClass}
              required
            />
          </div>
          <div>
            <label htmlFor="short_description" className="block text-sm font-medium text-white mb-2">
              Short description
            </label>
            <input
              id="short_description"
              name="short_description"
              value={formData.short_description}
              onChange={handleChange}
              maxLength={200}
              className={fieldClass}
            />
          </div>
          <div>
            <label htmlFor="description" className="block text-sm font-medium text-white mb-2">
              Description *
            </label>
            <textarea
              id="description"
              name="description"
              value={formData.description}
              onChange={handleChange}
              rows={8}
              className={`${fieldClass} resize-vertical`}
              required
            />
          </div>
          <div>
            <label htmlFor="website" className="block text-sm font-medium text-white mb-2">
              Website
            </label>
            <input
              id="website"
              name="website"
              type="url"
              value={formData.website}
              onChange={handleChange}
              className={fieldClass}
            />
          </div>
          <div>
            <label htmlFor="logo_url" className="block text-sm font-medium text-white mb-2">
              Logo URL
            </label>
            <input
              id="logo_url"
              name="logo_url"
              type="url"
              value={formData.logo_url}
              onChange={handleChange}
              className={fieldClass}
            />
          </div>
          <div>
            <label htmlFor="startup_benefits" className="block text-sm font-medium text-white mb-2">
              Why founders use it
            </label>
            <textarea
              id="startup_benefits"
              name="startup_benefits"
              value={formData.startup_benefits}
              onChange={handleChange}
              rows={4}
              className={`${fieldClass} resize-vertical`}
            />
          </div>
          <div>
            <label htmlFor="features" className="block text-sm font-medium text-white mb-2">
              Key features
            </label>
            <input
              id="features"
              name="features"
              value={formData.features}
              onChange={handleChange}
              placeholder="Comma-separated"
              className={fieldClass}
            />
          </div>
          <div>
            <label htmlFor="use_cases" className="block text-sm font-medium text-white mb-2">
              Who should use it
            </label>
            <input
              id="use_cases"
              name="use_cases"
              value={formData.use_cases}
              onChange={handleChange}
              placeholder="Comma-separated"
              className={fieldClass}
            />
          </div>
          <button
            type="submit"
            disabled={loading}
            className="w-full py-3 px-6 rounded-lg font-medium bg-[var(--brand-primary)] text-[var(--ink)] disabled:opacity-50"
          >
            {loading ? 'Saving…' : 'Save changes'}
          </button>
        </form>
      </div>
    </section>
  );
}
