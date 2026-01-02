import bcrypt from 'bcryptjs';
import logger from '../config/logger.js';

const SALT_ROUNDS = 10;

/**
 * Hash a plain text value (e.g., password)
 * @param {string} plainText - The plain text to hash
 * @returns {Promise<string>} The hashed value
 */
export const hashValue = async (plainText) => {
    try {
        const salt = await bcrypt.genSalt(SALT_ROUNDS);
        const hashed = await bcrypt.hash(plainText, salt);
        return hashed;
    } catch (error) {
        logger.error('Error hashing value', { error: error.message });
        throw new Error('Encryption failed');
    }
};

/**
 * Compare a plain text value with a hashed value
 * @param {string} plainText - The plain text to compare
 * @param {string} hashedValue - The hashed value to compare against
 * @returns {Promise<boolean>} True if they match, false otherwise
 */
export const compareHash = async (plainText, hashedValue) => {
    try {
        const isMatch = await bcrypt.compare(plainText, hashedValue);
        return isMatch;
    } catch (error) {
        logger.error('Error comparing hash', { error: error.message });
        throw new Error('Comparison failed');
    }
};

/**
 * Sanitize sensitive data for logging
 * @param {object} data - The data object to sanitize
 * @param {string[]} sensitiveFields - Array of field names to mask
 * @returns {object} Sanitized data object
 */
export const sanitizeForLogging = (data, sensitiveFields = ['password', 'token', 'secret']) => {
    if (!data || typeof data !== 'object') return data;

    const sanitized = { ...data };

    sensitiveFields.forEach(field => {
        if (sanitized[field]) {
            sanitized[field] = '***REDACTED***';
        }
    });

    return sanitized;
};
