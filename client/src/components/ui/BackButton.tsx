import React from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { ArrowLeft } from 'lucide-react';
import { getParentPath, hasParentPath } from '@/utils/pathUtils';
import { cn } from '@/utils/cn';

interface BackButtonProps {
  className?: string;
  /**
   * If true, shows the button even on root-level pages (will navigate to /dashboard)
   * Default: false (hides on root-level pages)
   */
  showOnRoot?: boolean;
}

/**
 * Universal Back Button Component
 * Navigates to parent path (not browser history)
 * Icon-only design for consistency across the entire application
 */
export const BackButton: React.FC<BackButtonProps> = ({ className, showOnRoot = false }) => {
  const navigate = useNavigate();
  const location = useLocation();

  // Don't show back button if we're at root level (unless showOnRoot is true)
  if (!showOnRoot && !hasParentPath(location.pathname)) {
    return null;
  }

  const handleBack = () => {
    const parentPath = getParentPath(location.pathname);
    // If we're at root and showOnRoot is true, go to dashboard
    if (parentPath === location.pathname && showOnRoot) {
      navigate('/dashboard');
    } else {
      navigate(parentPath);
    }
  };

  return (
    <button
      onClick={handleBack}
      className={cn(
        'inline-flex items-center justify-center w-10 h-10 rounded-lg transition-all cursor-pointer',
        'text-[var(--text-secondary)] hover:text-[var(--primary)] hover:bg-[var(--surface-highlight)]',
        'border border-[var(--border)] hover:border-[var(--primary)]',
        className
      )}
      aria-label="Go back to parent page"
      title="Go back"
    >
      <ArrowLeft size={24} className="shrink-0" />
    </button>
  );
};
