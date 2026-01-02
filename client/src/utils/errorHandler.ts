import { showToast } from './toast';
import logger from './logger';

/**
 * Centralized error handler for API requests
 * Distinguishes between network errors, server errors, and application errors
 */

export interface ApiError {
  type: 'network' | 'server' | 'application';
  message: string;
  originalError?: unknown;
}

/**
 * Determines the type of error and returns appropriate error information
 */
export function categorizeError(error: unknown): ApiError {
  // Check if it's a network error (no internet, timeout, etc.)
  if (error instanceof TypeError && error.message.includes('fetch')) {
    return {
      type: 'network',
      message: 'Network error: Please check your internet connection',
      originalError: error,
    };
  }

  // Check for common network error patterns
  if (error instanceof Error) {
    const errorMessage = error.message.toLowerCase();

    // Network connection issues
    if (
      errorMessage.includes('network') ||
      errorMessage.includes('failed to fetch') ||
      errorMessage.includes('networkerror') ||
      errorMessage.includes('net::err')
    ) {
      return {
        type: 'network',
        message: 'No internet connection. Please check your network and try again.',
        originalError: error,
      };
    }

    // Timeout errors
    if (errorMessage.includes('timeout') || errorMessage.includes('timed out')) {
      return {
        type: 'network',
        message: 'Request timed out. Please check your internet connection and try again.',
        originalError: error,
      };
    }

    // CORS errors
    if (errorMessage.includes('cors')) {
      return {
        type: 'server',
        message: 'Server configuration error. Please contact support.',
        originalError: error,
      };
    }
  }

  // If it's an object with error property (API response error)
  if (typeof error === 'object' && error !== null && 'error' in error) {
    return {
      type: 'server',
      message: (error as { error: string }).error || 'Server error occurred',
      originalError: error,
    };
  }

  // Default to application error
  return {
    type: 'application',
    message: 'An unexpected error occurred. Please try again.',
    originalError: error,
  };
}

/**
 * Handles errors and displays appropriate toast messages
 * @param error - The error object
 * @param context - Context of where the error occurred (e.g., 'creating department')
 * @param customMessage - Optional custom message to override default
 */
export function handleApiError(error: unknown, context?: string, customMessage?: string): void {
  const categorizedError = categorizeError(error);

  // Log the error for debugging
  logger.error(`Error ${context ? `while ${context}` : 'occurred'}:`, {
    type: categorizedError.type,
    message: categorizedError.message,
    originalError: categorizedError.originalError,
  });

  // Determine the message to show
  let displayMessage: string;

  if (customMessage) {
    displayMessage = customMessage;
  } else if (categorizedError.type === 'network') {
    displayMessage = categorizedError.message;
  } else if (categorizedError.type === 'server') {
    displayMessage = categorizedError.message;
  } else {
    displayMessage = context
      ? `Failed to ${context}. ${categorizedError.message}`
      : categorizedError.message;
  }

  // Show appropriate toast
  showToast.error(displayMessage);
}

/**
 * Checks if the user is online
 */
export function isOnline(): boolean {
  return navigator.onLine;
}

/**
 * Shows a toast if the user is offline
 * @returns true if offline (toast shown), false if online
 */
export function checkAndNotifyIfOffline(): boolean {
  if (!isOnline()) {
    showToast.error('No internet connection. Please check your network.');
    return true;
  }
  return false;
}
