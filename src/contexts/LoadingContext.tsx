import React, { createContext, useContext, useState, ReactNode, useCallback } from 'react';

interface LoadingContextType {
  isLoading: boolean;
  setLoading: (loading: boolean) => void;
  loadingCount: number;
}

const LoadingContext = createContext<LoadingContextType | undefined>(undefined);

interface LoadingProviderProps {
  children: ReactNode;
}

export function LoadingProvider({ children }: LoadingProviderProps) {
  const [loadingCount, setLoadingCount] = useState(0);

  const setLoading = useCallback((loading: boolean) => {
    console.log('LoadingContext: setLoading called with:', loading);
    setLoadingCount(prev => {
      const newCount = loading ? prev + 1 : Math.max(0, prev - 1);
      console.log('LoadingContext: loadingCount changed from', prev, 'to', newCount);
      return newCount;
    });
  }, []);

  const isLoading = loadingCount > 0;

  return (
    <LoadingContext.Provider value={{ isLoading, setLoading, loadingCount }}>
      {children}
    </LoadingContext.Provider>
  );
}

export function useLoading() {
  const context = useContext(LoadingContext);
  if (context === undefined) {
    throw new Error('useLoading must be used within a LoadingProvider');
  }
  return context;
}
