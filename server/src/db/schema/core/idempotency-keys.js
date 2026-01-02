/**
 * Idempotency Keys Schema
 *
 * Stores idempotency keys to prevent duplicate POST operations.
 * Keys expire after 24 hours and are automatically cleaned up.
 */

import { serial, varchar, integer, text, timestamp } from 'drizzle-orm/pg-core';
import { appSchema } from './app-schema.js';

export const idempotencyKeys = appSchema.table('idempotency_keys', {
  id: serial('id').primaryKey(),
  // Unique key provided by client (UUID recommended)
  key: varchar('key', { length: 255 }).notNull().unique(),
  // Endpoint that was called (e.g., POST /api/orders)
  endpoint: varchar('endpoint', { length: 255 }).notNull(),
  // User who made the request (for scoping keys per user)
  userId: integer('user_id'),
  // HTTP status code of the original response
  statusCode: integer('status_code'),
  // JSON stringified response body
  responseBody: text('response_body'),
  // When the key was created
  createdAt: timestamp('created_at', { withTimezone: true }).defaultNow(),
  // When the key expires (default 24 hours from creation)
  expiresAt: timestamp('expires_at', { withTimezone: true }).notNull(),
});
