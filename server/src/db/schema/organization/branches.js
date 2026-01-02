/**
 * Branches Schema
 *
 * Manages company branches/locations.
 * Employees can be assigned to specific branches.
 */

import { serial, varchar, text, boolean, timestamp } from 'drizzle-orm/pg-core';
import { appSchema } from '../core/app-schema.js';

export const branches = appSchema.table('branches', {
  branchId: serial('branch_id').primaryKey(),
  branchName: varchar('branch_name', { length: 255 }).notNull().unique(),
  address: text('address'),
  isActive: boolean('is_active').notNull().default(true),
  createdAt: timestamp('created_at', { withTimezone: true }).defaultNow(),
});
