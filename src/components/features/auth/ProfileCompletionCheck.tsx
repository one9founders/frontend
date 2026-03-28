'use client';

import { useState, useEffect } from 'react';
import { getCurrentUser } from '@/lib/actions/auth';
import ProfileCompletionModal from './ProfileCompletionModal';

export default function ProfileCompletionCheck() {
  const [showModal, setShowModal] = useState(false);

  useEffect(() => {
    getCurrentUser().then((user) => {
      if (user && user.profile_completed === false) {
        setShowModal(true);
      }
    });
  }, []);

  if (!showModal) return null;

  return <ProfileCompletionModal onComplete={() => setShowModal(false)} />;
}
