/**
 * Suppliers Schema
 *
 * Manages supplier information for material inward tracking.
 * Each supplier can have multiple bills with the same bill number.
 */

import { serial, varchar, boolean, timestamp } from 'drizzle-orm/pg-core';
import { appSchema } from '../core/app-schema.js';

export const suppliers = appSchema.table('suppliers', {
  supplierId: serial('supplier_id').primaryKey(),
  supplierName: varchar('supplier_name', { length: 255 }).notNull().unique(),
  isActive: boolean('is_active').default(true),
  createdAt: timestamp('created_at', { withTimezone: true }).defaultNow(),
  updatedAt: timestamp('updated_at', { withTimezone: true }).defaultNow(),
});
