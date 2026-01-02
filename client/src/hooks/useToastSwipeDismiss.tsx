/**
 * Toast Swipe-to-Dismiss Enhancement
 * Adds swipe gesture support to AntD notifications on mobile
 */

import { useEffect, useCallback } from 'react';

const SWIPE_THRESHOLD = 60; // Minimum pixels to trigger dismiss
const SWIPE_VELOCITY_THRESHOLD = 0.4; // Minimum velocity to trigger dismiss

export function useToastSwipeDismiss() {
  const findNoticeElement = useCallback((target: HTMLElement): HTMLElement | null => {
    // Try multiple selectors for AntD notification elements
    return (target.closest('.ant-notification-notice') ||
      target.closest('.ant-notification-notice-wrapper')) as HTMLElement | null;
  }, []);

  const handleTouchStart = useCallback(
    (e: TouchEvent) => {
      const target = e.target as HTMLElement;
      const noticeElement = findNoticeElement(target);

      if (!noticeElement) return;

      const touch = e.touches[0];
      noticeElement.dataset.swipeStartX = String(touch.clientX);
      noticeElement.dataset.swipeStartY = String(touch.clientY);
      noticeElement.dataset.swipeStartTime = String(Date.now());
      noticeElement.style.transition = 'none';
      noticeElement.style.willChange = 'transform, opacity';
    },
    [findNoticeElement]
  );

  const handleTouchMove = useCallback(
    (e: TouchEvent) => {
      const target = e.target as HTMLElement;
      const noticeElement = findNoticeElement(target);

      if (!noticeElement || !noticeElement.dataset.swipeStartX) return;

      const touch = e.touches[0];
      const startX = parseFloat(noticeElement.dataset.swipeStartX);
      const startY = parseFloat(noticeElement.dataset.swipeStartY || '0');
      const deltaX = touch.clientX - startX;
      const deltaY = touch.clientY - startY;

      // If vertical scroll is more significant, don't interfere
      if (Math.abs(deltaY) > Math.abs(deltaX) * 1.5 && Math.abs(deltaX) < 15) {
        return;
      }

      // Prevent page scroll while swiping toast horizontally
      if (Math.abs(deltaX) > 10) {
        e.preventDefault();
      }

      // Apply resistance when swiping left (opposite direction)
      const resistance = deltaX < 0 ? 0.2 : 1;
      const translateX = deltaX * resistance;

      // Calculate opacity based on swipe distance
      const opacity = Math.max(0.4, 1 - Math.abs(deltaX) / 250);

      noticeElement.style.transform = `translateX(${translateX}px)`;
      noticeElement.style.opacity = String(opacity);
    },
    [findNoticeElement]
  );

  const handleTouchEnd = useCallback(
    (e: TouchEvent) => {
      const target = e.target as HTMLElement;
      const noticeElement = findNoticeElement(target);

      if (!noticeElement || !noticeElement.dataset.swipeStartX) return;

      const startX = parseFloat(noticeElement.dataset.swipeStartX);
      const startTime = parseFloat(noticeElement.dataset.swipeStartTime || '0');
      const endX = e.changedTouches[0].clientX;
      const deltaX = endX - startX;
      const duration = Date.now() - startTime;
      const velocity = Math.abs(deltaX) / duration;

      // Clean up data attributes
      delete noticeElement.dataset.swipeStartX;
      delete noticeElement.dataset.swipeStartY;
      delete noticeElement.dataset.swipeStartTime;
      noticeElement.style.willChange = 'auto';

      // Check if swipe was significant enough to dismiss (both left and right)
      const shouldDismiss =
        Math.abs(deltaX) > SWIPE_THRESHOLD ||
        (velocity > SWIPE_VELOCITY_THRESHOLD && Math.abs(deltaX) > 25);

      if (shouldDismiss) {
        // Dismiss with animation in swipe direction
        const direction = deltaX > 0 ? 1 : -1;
        noticeElement.style.transition = 'transform 0.2s ease-out, opacity 0.2s ease-out';
        noticeElement.style.transform = `translateX(${direction * 120}%)`;
        noticeElement.style.opacity = '0';

        // Find and click the close button after animation
        setTimeout(() => {
          const closeButton = noticeElement.querySelector(
            '.ant-notification-notice-close'
          ) as HTMLElement;
          if (closeButton) {
            closeButton.click();
          } else {
            // Fallback: hide element
            noticeElement.style.display = 'none';
          }
        }, 200);
      } else {
        // Snap back
        noticeElement.style.transition = 'transform 0.2s ease-out, opacity 0.2s ease-out';
        noticeElement.style.transform = 'translateX(0)';
        noticeElement.style.opacity = '1';
      }
    },
    [findNoticeElement]
  );

  useEffect(() => {
    // Enable on all devices for testing, touch events only fire on touch devices anyway
    document.addEventListener('touchstart', handleTouchStart, { passive: true });
    document.addEventListener('touchmove', handleTouchMove, { passive: false });
    document.addEventListener('touchend', handleTouchEnd, { passive: true });

    return () => {
      document.removeEventListener('touchstart', handleTouchStart);
      document.removeEventListener('touchmove', handleTouchMove);
      document.removeEventListener('touchend', handleTouchEnd);
    };
  }, [handleTouchStart, handleTouchMove, handleTouchEnd]);
}

/**
 * Component wrapper that enables swipe-to-dismiss for toasts
 * Add this to your App.tsx or a layout component
 */
export function ToastSwipeProvider({ children }: { children: React.ReactNode }) {
  useToastSwipeDismiss();
  return <>{children}</>;
}
