/**
 * Material Inward Schema
 *
 * Tracks incoming materials/products.
 * Records supplier information, quantities, and costs.
 * Bill uniqueness is validated via composite key: billNo + supplierId + productType + date
 */

import { bigserial, uuid, integer, varchar, timestamp, numeric, text } from 'drizzle-orm/pg-core';
import { appSchema } from '../core/app-schema.js';
import { masterProducts } from '../products/master-products.js';
import { suppliers } from './suppliers.js';
import { customers } from '../sales/customers.js';

export const materialInward = appSchema.table('material_inward', {
  inwardId: bigserial('inward_id', { mode: 'bigint' }).primaryKey(),
  inwardUuid: uuid('inward_uuid').defaultRandom().notNull(),
  masterProductId: integer('master_product_id')
    .notNull()
    .references(() => masterProducts.masterProductId),
  productId: integer('product_id'), // For FG: tracks specific SKU (e.g., "Black JAPAN 1L")
  supplierId: integer('supplier_id').references(() => suppliers.supplierId), // For RM/PM: supplier (nullable for FG)
  billNo: varchar('bill_no', { length: 50 }).default('').notNull(),
  inwardDate: timestamp('inward_date', { withTimezone: true }).defaultNow(),
  quantity: numeric('quantity', { precision: 18, scale: 4 }).notNull(),
  unitId: integer('unit_id'),
  unitPrice: numeric('unit_price', { precision: 14, scale: 3 }).default('0'),
  totalCost: numeric('total_cost', { precision: 20, scale: 3 }).default('0'),
  notes: text('notes'),
  createdAt: timestamp('created_at', { withTimezone: true }).defaultNow(),
  updatedAt: timestamp('updated_at', { withTimezone: true }).defaultNow(),
});
