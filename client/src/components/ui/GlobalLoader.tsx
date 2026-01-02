import React, { useEffect, useState } from 'react';
import { useGlobalLoading } from '../../hooks/useGlobalLoading';

/**
 * A professional, high-performance global progress bar.
 * Inspired by YouTube/GitHub loading indicators.
 */
export const GlobalLoader: React.FC = () => {
  const isLoading = useGlobalLoading();
  const [visible, setVisible] = useState(false);
  const [progress, setProgress] = useState(0);

  useEffect(() => {
    let interval: ReturnType<typeof setInterval>;
    let timeout: ReturnType<typeof setTimeout>;

    if (isLoading) {
      setVisible(true);
      setProgress(0);

      // Artificial progress to make it look smooth
      interval = setInterval(() => {
        setProgress(prev => {
          if (prev < 30) return prev + 5;
          if (prev < 60) return prev + 3;
          if (prev < 90) return prev + 1;
          return prev;
        });
      }, 200);
    } else {
      setProgress(100);
      timeout = setTimeout(() => {
        setVisible(false);
        setProgress(0);
      }, 400); // Wait for transition to finish
    }

    return () => {
      if (interval) clearInterval(interval);
      if (timeout) clearTimeout(timeout);
    };
  }, [isLoading]);

  if (!visible && !isLoading) return null;

  return (
    <div
      className={`fixed top-0 left-0 right-0 z-[9999] h-0.5 transition-opacity duration-300 ${
        progress === 100 ? 'opacity-0' : 'opacity-100'
      }`}
    >
      <div
        className="h-full bg-[var(--primary)] transition-all duration-300 ease-out shadow-[0_0_10px_var(--primary)]"
        style={{ width: `${progress}%` }}
      />

      {/* Subtle Spinner in the corner */}
      <div className="absolute top-4 right-4 animate-spin rounded-full h-4 w-4 border-2 border-[var(--primary)] border-t-transparent opacity-50" />
    </div>
  );
};
