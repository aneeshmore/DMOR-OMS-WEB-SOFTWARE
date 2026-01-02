import { useState, useEffect } from 'react';
import { loadingStore } from '../utils/loadingStore';

/**
 * Hook to consume the global loading state.
 * Fixed: Using relative path to avoid potential alias resolution issues in some environments.
 */
export const useGlobalLoading = () => {
  const [isLoading, setIsLoading] = useState(loadingStore.getCount() > 0);

  useEffect(() => {
    // Return the unsubscribe function directly
    return loadingStore.subscribe(count => {
      setIsLoading(count > 0);
    });
  }, []);

  return isLoading;
};
