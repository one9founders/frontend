'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { getCurrentUser } from '@/lib/actions/auth';
import BasicDetailsForm from './BasicDetailsForm';
import QuestionnaireForm from './QuestionnaireForm';
import ProgressIndicator from './ProgressIndicator';

export default function ApplicationForm() {
  const [user, setUser] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [step, setStep] = useState<'details' | 'questionnaire'>('details');
  const [selectedTrack, setSelectedTrack] = useState('');
  const [basicDetails, setBasicDetails] = useState<any>(null);
  const router = useRouter();

  useEffect(() => {
    getCurrentUser().then(u => {
      setUser(u);
      setLoading(false);
    });
  }, []);

  const handleDetailsComplete = (track: string, data: any) => {
    setSelectedTrack(track);
    setBasicDetails(data);
    setStep('questionnaire');
  };

  if (loading) {
    return (
      <div className="max-w-2xl mx-auto px-4 py-16 text-center">
        <p className="text-white">Loading...</p>
      </div>
    );
  }

  return (
    <div className="max-w-3xl mx-auto px-4 py-16">
      <ProgressIndicator currentStep={step === 'details' ? 1 : 2} totalSteps={2} />
      
      {step === 'details' && (
        <BasicDetailsForm user={user} onComplete={handleDetailsComplete} />
      )}

      {step === 'questionnaire' && (
        <QuestionnaireForm track={selectedTrack} user={user} basicDetails={basicDetails} />
      )}
    </div>
  );
}
