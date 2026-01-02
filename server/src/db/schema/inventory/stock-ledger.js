/**
 * Stock Ledger Schema
 *
 * Audit trail for all inventory movements.
 * Records every change in stock with references to source transactions.
 */

import { bigserial, integer, varchar, numeric, text, bigint, timestamp } from 'drizzle-orm/pg-core';
import { appSchema } from '../core/app-schema.js';

export const stockLedger = appSchema.table('stock_ledger', {
  ledgerId: bigserial('ledger_id', { mode: 'bigint' }).primaryKey(),
  productId: integer('product_id').notNull(),
  changeType: varchar('change_type', { length: 50 }).notNull(),
  changeQty: integer('change_qty').notNull(),
  referenceTable: text('reference_table'),
  referenceId: bigint('reference_id', { mode: 'bigint' }),
  createdBy: integer('created_by'),
  createdAt: timestamp('created_at', { withTimezone: true }).defaultNow(),
  notes: text('notes'),
});
