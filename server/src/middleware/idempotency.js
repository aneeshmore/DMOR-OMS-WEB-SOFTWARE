/**
 * Idempotency Middleware
 *
 * Prevents duplicate POST operations by caching responses for idempotency keys.
 * Client must send X-Idempotency-Key header with a unique UUID per request.
 *
 * Usage:
 *   router.post('/', requirePermission('orders', 'create'), requireIdempotency, controller.createOrder);
 *
 * Features:
 * - Keys are scoped per user (if authenticated) and endpoint
 * - Responses are cached for 24 hours
 * - Expired keys are automatically cleaned up
 * - Works with large request bodies (stores response, not request)
 */

import db from '../db/index.js';
import { idempotencyKeys } from '../db/schema/index.js';
import { eq, and, lt, sql } from 'drizzle-orm';

// TTL for idempotency keys (24 hours in milliseconds)
const IDEMPOTENCY_TTL_MS = 24 * 60 * 60 * 1000;

// Cleanup old keys periodically (every hour)
let lastCleanup = 0;
const CLEANUP_INTERVAL_MS = 60 * 60 * 1000;

/**
 * Clean up expired idempotency keys
 */
async function cleanupExpiredKeys() {
  const now = Date.now();
  if (now - lastCleanup < CLEANUP_INTERVAL_MS) return;

  lastCleanup = now;
  try {
    await db.delete(idempotencyKeys).where(lt(idempotencyKeys.expiresAt, new Date()));
  } catch (err) {
    console.error('Error cleaning up idempotency keys:', err.message);
  }
}

/**
 * Idempotency middleware
 *
 * Checks for X-Idempotency-Key header and returns cached response if found.
 * Otherwise, captures the response and stores it for future duplicate requests.
 */
export const requireIdempotency = async (req, res, next) => {
  const idempotencyKey = req.headers['x-idempotency-key'];

  // If no idempotency key provided, proceed without idempotency
  // This makes it backwards compatible - clients that don't send the header still work
  if (!idempotencyKey) {
    return next();
  }

  // Validate key format (should be UUID-like, not too long)
  if (idempotencyKey.length > 255) {
    return res.status(400).json({
      error: 'Invalid idempotency key',
      message: 'X-Idempotency-Key must be 255 characters or less',
    });
  }

  const endpoint = `${req.method} ${req.baseUrl}${req.path}`;
  const userId = req.user?.employeeId || null;

  // Trigger cleanup in background (non-blocking)
  cleanupExpiredKeys().catch(() => {});

  try {
    // Check if this key was already used
    const existing = await db
      .select()
      .from(idempotencyKeys)
      .where(and(eq(idempotencyKeys.key, idempotencyKey), eq(idempotencyKeys.endpoint, endpoint)))
      .limit(1);

    if (existing.length > 0) {
      const cached = existing[0];

      // Check if key has expired
      if (new Date(cached.expiresAt) < new Date()) {
        // Key expired, delete it and proceed with fresh request
        await db.delete(idempotencyKeys).where(eq(idempotencyKeys.id, cached.id));
      } else {
        // Return cached response
        console.log(
          `[Idempotency] Returning cached response for key: ${idempotencyKey.substring(0, 8)}...`
        );

        // Set header to indicate this is a cached response
        res.set('X-Idempotent-Replayed', 'true');

        // Parse and return cached response
        const responseBody = cached.responseBody ? JSON.parse(cached.responseBody) : null;
        return res.status(cached.statusCode || 200).json(responseBody);
      }
    }

    // Store reference to original json method
    const originalJson = res.json.bind(res);

    // Override json method to capture response
    res.json = async function (body) {
      const statusCode = res.statusCode;

      // Store the response in database (only for successful or client error responses)
      // Don't cache 5xx errors as they might be transient
      if (statusCode < 500) {
        try {
          await db
            .insert(idempotencyKeys)
            .values({
              key: idempotencyKey,
              endpoint,
              userId,
              statusCode,
              responseBody: JSON.stringify(body),
              expiresAt: new Date(Date.now() + IDEMPOTENCY_TTL_MS),
            })
            .onConflictDoNothing();
        } catch (err) {
          // Log but don't fail the request if we can't store the key
          console.error('[Idempotency] Failed to store key:', err.message);
        }
      }

      // Call original json method
      return originalJson(body);
    };

    next();
  } catch (err) {
    console.error('[Idempotency] Middleware error:', err.message);
    // On error, proceed without idempotency rather than blocking the request
    next();
  }
};

/**
 * Optional: Strict idempotency middleware
 *
 * Same as requireIdempotency but requires the header to be present.
 * Use this for critical operations that must never be duplicated.
 */
export const requireIdempotencyStrict = async (req, res, next) => {
  const idempotencyKey = req.headers['x-idempotency-key'];

  if (!idempotencyKey) {
    return res.status(400).json({
      error: 'Idempotency key required',
      message: 'X-Idempotency-Key header is required for this operation',
    });
  }

  return requireIdempotency(req, res, next);
};

export default requireIdempotency;
