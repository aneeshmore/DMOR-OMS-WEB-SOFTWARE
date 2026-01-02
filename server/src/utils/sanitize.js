/**
 * Input Sanitization Utility
 *
 * Provides XSS prevention and input sanitization for API inputs.
 * This module strips dangerous HTML/JS content from user inputs.
 */

/**
 * Escape HTML special characters to prevent XSS
 * @param {string} str - Input string to sanitize
 * @returns {string} - Sanitized string
 */
export function escapeHtml(str) {
  if (typeof str !== 'string') return str;

  return str
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#x27;')
    .replace(/\//g, '&#x2F;')
    .replace(/`/g, '&#x60;');
}

/**
 * Strip all HTML tags from string
 * @param {string} str - Input string
 * @returns {string} - String with HTML tags removed
 */
export function stripHtml(str) {
  if (typeof str !== 'string') return str;

  return str
    .replace(/<[^>]*>/g, '') // Remove all HTML tags
    .replace(/javascript:/gi, '') // Remove javascript: protocol
    .replace(/on\w+=/gi, '') // Remove event handlers like onclick=
    .replace(/data:/gi, '') // Remove data: protocol
    .trim();
}

/**
 * Sanitize a string for safe storage and display
 * Removes dangerous content while preserving readable text
 * @param {string} str - Input string
 * @returns {string} - Sanitized string
 */
export function sanitizeString(str) {
  if (typeof str !== 'string') return str;
  if (!str || str.trim() === '') return str;

  // First strip HTML tags
  let sanitized = stripHtml(str);

  // Then escape any remaining special characters
  sanitized = escapeHtml(sanitized);

  return sanitized;
}

/**
 * Sanitize all string properties in an object
 * @param {Object} obj - Object with string properties to sanitize
 * @param {string[]} fieldsToSanitize - Array of field names to sanitize (optional, sanitizes all strings if not provided)
 * @returns {Object} - Object with sanitized string properties
 */
export function sanitizeObject(obj, fieldsToSanitize = null) {
  if (!obj || typeof obj !== 'object') return obj;

  const result = { ...obj };

  for (const [key, value] of Object.entries(result)) {
    // Skip if specific fields are provided and this isn't one
    if (fieldsToSanitize && !fieldsToSanitize.includes(key)) continue;

    if (typeof value === 'string') {
      result[key] = sanitizeString(value);
    } else if (typeof value === 'object' && value !== null && !Array.isArray(value)) {
      result[key] = sanitizeObject(value, fieldsToSanitize);
    }
  }

  return result;
}

/**
 * Middleware to sanitize request body
 * @param {string[]} fieldsToSanitize - Optional array of specific field names to sanitize
 * @returns {Function} Express middleware
 */
export function sanitizeBody(fieldsToSanitize = null) {
  return (req, res, next) => {
    if (req.body && typeof req.body === 'object') {
      req.body = sanitizeObject(req.body, fieldsToSanitize);
    }
    next();
  };
}

/**
 * Sanitize query parameters
 * @param {string[]} fieldsToSanitize - Optional array of specific field names to sanitize
 * @returns {Function} Express middleware
 */
export function sanitizeQuery(fieldsToSanitize = null) {
  return (req, res, next) => {
    if (req.query && typeof req.query === 'object') {
      req.query = sanitizeObject(req.query, fieldsToSanitize);
    }
    next();
  };
}

export default {
  escapeHtml,
  stripHtml,
  sanitizeString,
  sanitizeObject,
  sanitizeBody,
  sanitizeQuery,
};
