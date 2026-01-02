import React, { useEffect } from 'react';
import { Loader2 } from 'lucide-react';

interface FullScreenLoaderProps {
  isLoading: boolean;
  message?: string;
}

export const FullScreenLoader: React.FC<FullScreenLoaderProps> = ({
  isLoading,
  message = 'Processing...',
}) => {
  // Prevent scrolling when loader is active
  useEffect(() => {
    if (isLoading) {
      // Save current scroll position
      const scrollY = window.scrollY;

      // Prevent scrolling
      document.body.style.overflow = 'hidden';
      document.body.style.position = 'fixed';
      document.body.style.top = `-${scrollY}px`;
      document.body.style.width = '100%';

      return () => {
        // Restore scrolling
        document.body.style.overflow = '';
        document.body.style.position = '';
        document.body.style.top = '';
        document.body.style.width = '';

        // Restore scroll position
        window.scrollTo(0, scrollY);
      };
    }
  }, [isLoading]);

  if (!isLoading) return null;

  return (
    <div
      className="fixed inset-0 w-screen h-screen z-[9999] flex items-center justify-center bg-black/40 backdrop-blur-sm animate-in fade-in duration-200"
      style={{ touchAction: 'none', width: '100vw', height: '100vh' }}
    >
      <div className="bg-[var(--surface)] rounded-2xl shadow-2xl p-8 flex flex-col items-center gap-4 animate-in zoom-in-95 duration-300 border border-[var(--border)]">
        {/* Animated Spinner - Only rotating loader */}
        <Loader2 className="w-16 h-16 text-[var(--primary)] animate-spin" strokeWidth={2.5} />

        {/* Message */}
        <div className="text-center">
          <p className="text-lg font-semibold text-[var(--text-primary)] mb-1">{message}</p>
          <p className="text-sm text-[var(--text-secondary)]">Please wait...</p>
        </div>

        {/* Animated dots */}
        <div className="flex gap-1.5">
          <div className="w-2 h-2 rounded-full bg-[var(--primary)] animate-bounce [animation-delay:-0.3s]"></div>
          <div className="w-2 h-2 rounded-full bg-[var(--primary)] animate-bounce [animation-delay:-0.15s]"></div>
          <div className="w-2 h-2 rounded-full bg-[var(--primary)] animate-bounce"></div>
        </div>
      </div>
    </div>
  );
};
