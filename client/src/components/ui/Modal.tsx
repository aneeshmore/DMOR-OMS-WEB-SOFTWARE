/**
 * Modal Component
 * Reusable modal dialog with backdrop and animations
 */

import React, { useEffect } from 'react';
import { X } from 'lucide-react';
import { cn } from '@/utils/cn';
import { useSidebar } from '@/contexts/SidebarContext';

export interface ModalProps {
  isOpen: boolean;
  onClose: () => void;
  title?: string;
  children: React.ReactNode;
  size?: 'sm' | 'md' | 'lg' | 'xl' | 'full';
  showCloseButton?: boolean;
  closeOnBackdrop?: boolean;
  footer?: React.ReactNode;
}

export const Modal: React.FC<ModalProps> = ({
  isOpen,
  onClose,
  title,
  children,
  size = 'md',
  showCloseButton = true,
  closeOnBackdrop = true,
  footer,
}) => {
  const { isCollapsed } = useSidebar();
  // Prevent body scroll when modal is open
  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = 'unset';
    }
    return () => {
      document.body.style.overflow = 'unset';
    };
  }, [isOpen]);

  // Handle escape key
  useEffect(() => {
    const handleEscape = (e: KeyboardEvent) => {
      if (e.key === 'Escape' && isOpen) {
        onClose();
      }
    };
    document.addEventListener('keydown', handleEscape);
    return () => document.removeEventListener('keydown', handleEscape);
  }, [isOpen, onClose]);

  if (!isOpen) return null;

  const sizeClasses = {
    sm: 'max-w-md',
    md: 'max-w-2xl',
    lg: 'max-w-4xl',
    xl: 'max-w-6xl',
    full: 'max-w-[95vw]',
  };

  return (
    <div
      className={cn(
        'fixed inset-0 z-[99999] flex items-start justify-center pt-20 pb-4 px-4 sm:p-6 animate-fade-in overflow-y-auto',
        'md:left-20', // Collapsed sidebar on desktop
        !isCollapsed && 'lg:left-72' // Expanded sidebar on large screens
      )}
    >
      {' '}
      {/* Backdrop */}
      <div
        className="fixed inset-0 bg-black/50 backdrop-blur-sm z-0"
        onClick={closeOnBackdrop ? onClose : undefined}
        aria-hidden="true"
      />
      {/* Modal Container - centered with proper spacing */}
      <div className="relative w-full flex items-center justify-center min-h-full py-4 sm:py-12 z-10">
        {/* Modal */}
        <div
          className={cn(
            'relative card w-full max-h-[calc(100vh-6rem)] sm:max-h-[88vh] flex flex-col animate-scale-in shadow-[var(--shadow-2xl)] my-auto',
            sizeClasses[size]
          )}
          role="dialog"
          aria-modal="true"
          aria-labelledby={title ? 'modal-title' : undefined}
        >
          {/* Header */}
          {(title || showCloseButton) && (
            <div className="flex items-center justify-between p-4 sm:p-6 border-b border-[var(--border)] flex-shrink-0">
              {title && (
                <h2
                  id="modal-title"
                  className="text-lg sm:text-[var(--font-size-2xl)] font-bold text-[var(--text-primary)]"
                >
                  {title}
                </h2>
              )}
              {showCloseButton && (
                <button
                  onClick={onClose}
                  className="text-[var(--text-secondary)] hover:text-[var(--danger)] transition-colors p-2 rounded-lg hover:bg-[var(--surface-highlight)] focus-ring ml-auto"
                  aria-label="Close modal"
                >
                  <X size={20} className="sm:w-6 sm:h-6" />
                </button>
              )}
            </div>
          )}

          {/* Content - scrollable */}
          <div className="flex-1 overflow-y-auto p-4 sm:p-6">{children}</div>

          {/* Footer */}
          {footer && (
            <div className="p-4 sm:p-6 border-t border-[var(--border)] flex items-center justify-end gap-2 flex-shrink-0">
              {footer}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
