import React from 'react';
import { useLoading } from '@/contexts/LoadingContext';
import Spinner from './LoadingSpinner';

export function GlobalLoading() {
  const { isLoading } = useLoading();

  if (!isLoading) {
    return null;
  }

  return (
    <div className="fixed inset-0 flex items-center justify-center bg-white/60 backdrop-blur-sm z-50">
      <Spinner size="2xl" />
    </div>
  );
}
