'use client';

import { useState, useEffect } from 'react';
import { saveProgress } from '@/lib/actions/internship';

const colleges = ['IIT Bombay', 'IIT Delhi', 'IIT Madras', 'IIT Kanpur', 'BITS Pilani', 'NIT Trichy', 'Other'];

export default function BasicDetailsForm({ user, onComplete }: { user: any; onComplete: (track: string, data: any) => void }) {
  const [formData, setFormData] = useState({
    name: user?.name || '',
    email: user?.email || '',
    college: '',
    year: '',
    phone: '',
    linkedin: '',
    track: '',
    motivation: ''
  });
  const [charCount, setCharCount] = useState(0);

  useEffect(() => {
    const timer = setTimeout(() => {
      if (formData.track) {
        saveProgress({ step: 'details', data: formData });
      }
    }, 2000);
    return () => clearTimeout(timer);
  }, [formData]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.track) {
      alert('Please select a track');
      return;
    }
    onComplete(formData.track, formData);
  };

  const handleMotivationChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    const value = e.target.value.slice(0, 500);
    setFormData({ ...formData, motivation: value });
    setCharCount(value.length);
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <h2 className="text-3xl font-bold text-white mb-6">Basic Details</h2>

      <div>
        <label className="block text-white mb-2">Full Name</label>
        <input type="text" value={formData.name} onChange={e => setFormData({ ...formData, name: e.target.value })} className="w-full bg-[var(--gray-900)] border border-[var(--gray-800)] rounded-lg px-4 py-3 text-white" required />
      </div>

      <div>
        <label className="block text-white mb-2">Email</label>
        <input type="email" value={formData.email} readOnly className="w-full bg-[var(--gray-900)] border border-[var(--gray-800)] rounded-lg px-4 py-3 text-[var(--gray-500)]" />
      </div>

      <div>
        <label className="block text-white mb-2">College Name</label>
        <select value={formData.college} onChange={e => setFormData({ ...formData, college: e.target.value })} className="w-full bg-[var(--gray-900)] border border-[var(--gray-800)] rounded-lg px-4 py-3 text-white" required>
          <option value="">Select College</option>
          {colleges.map(c => <option key={c} value={c}>{c}</option>)}
        </select>
      </div>

      <div>
        <label className="block text-white mb-2">Current Year</label>
        <select value={formData.year} onChange={e => setFormData({ ...formData, year: e.target.value })} className="w-full bg-[var(--gray-900)] border border-[var(--gray-800)] rounded-lg px-4 py-3 text-white" required>
          <option value="">Select Year</option>
          <option value="1st">1st Year</option>
          <option value="2nd">2nd Year</option>
          <option value="3rd">3rd Year</option>
          <option value="4th">4th Year</option>
          <option value="other">Other</option>
        </select>
      </div>

      <div>
        <label className="block text-white mb-2">Phone Number</label>
        <div className="flex gap-2">
          <input type="text" value="+91" readOnly className="w-16 bg-[var(--gray-900)] border border-[var(--gray-800)] rounded-lg px-4 py-3 text-[var(--gray-500)]" />
          <input type="tel" pattern="[0-9]{10}" value={formData.phone} onChange={e => setFormData({ ...formData, phone: e.target.value })} className="flex-1 bg-[var(--gray-900)] border border-[var(--gray-800)] rounded-lg px-4 py-3 text-white" placeholder="10 digit number" required />
        </div>
      </div>

      <div>
        <label className="block text-white mb-2">LinkedIn URL (Optional)</label>
        <input type="url" value={formData.linkedin} onChange={e => setFormData({ ...formData, linkedin: e.target.value })} className="w-full bg-[var(--gray-900)] border border-[var(--gray-800)] rounded-lg px-4 py-3 text-white" placeholder="https://linkedin.com/in/yourprofile" />
      </div>

      <div>
        <label className="block text-white mb-2">Preferred Track</label>
        <div className="grid grid-cols-2 gap-4">
          {[
            { value: 'product', label: 'Product' },
            { value: 'uiux', label: 'UI/UX' },
            { value: 'design', label: 'Design' },
            { value: 'tech', label: 'Tech' }
          ].map(track => (
            <label key={track.value} className={`border rounded-lg p-4 cursor-pointer ${formData.track === track.value ? 'border-[var(--brand-primary)] bg-[var(--gray-900)]' : 'border-[var(--gray-800)] bg-[var(--gray-950)]'}`}>
              <input type="radio" name="track" value={track.value} checked={formData.track === track.value} onChange={e => setFormData({ ...formData, track: e.target.value })} className="mr-2" />
              <span className="text-white">{track.label}</span>
            </label>
          ))}
        </div>
      </div>

      <div>
        <label className="block text-white mb-2">What excites you most about AI tools and why do you want to join this internship?</label>
        <textarea value={formData.motivation} onChange={handleMotivationChange} className="w-full bg-[var(--gray-900)] border border-[var(--gray-800)] rounded-lg px-4 py-3 text-white h-32" required />
        <p className={`text-sm mt-1 ${charCount > 450 ? 'text-red-500' : charCount > 400 ? 'text-yellow-500' : 'text-[var(--gray-500)]'}`}>
          {charCount}/500 characters
        </p>
      </div>

      <button type="submit" className="btn-primary w-full py-4">Continue to Questions</button>
    </form>
  );
}
