import { useCallback } from 'react';
import { useLoading } from '@/contexts/LoadingContext';

export function useGlobalLoading() {
  const { setLoading } = useLoading();

  const showLoading = useCallback(() => {
    setLoading(true);
  }, [setLoading]);

  const hideLoading = useCallback(() => {
    setLoading(false);
  }, [setLoading]);

  const withLoading = useCallback(async <T>(asyncFn: () => Promise<T>): Promise<T> => {
    try {
      setLoading(true);
      const result = await asyncFn();
      return result;
    } finally {
      setLoading(false);
    }
  }, [setLoading]);

  return {
    showLoading,
    hideLoading,
    withLoading
  };
}
