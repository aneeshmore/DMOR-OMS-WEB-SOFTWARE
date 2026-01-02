/**
 * Product BOM (Bill of Materials) Schema
 *
 * Defines the composition of finished goods.
 * Maps raw materials to finished goods with percentage ratios.
 */

import { bigserial, integer, numeric, text, timestamp } from 'drizzle-orm/pg-core';
import { appSchema } from '../core/app-schema.js';
import { products } from './products.js';

export const productBom = appSchema.table('product_bom', {
  bomId: bigserial('bom_id', { mode: 'bigint' }).primaryKey(),
  finishedGoodId: integer('finished_good_id')
    .notNull()
    .references(() => products.productId, { onDelete: 'cascade' }),
  rawMaterialId: integer('raw_material_id')
    .notNull()
    .references(() => products.productId, { onDelete: 'cascade' }),
  percentage: numeric('percentage', { precision: 6, scale: 4 }).notNull(),
  notes: text('notes'),
  createdAt: timestamp('created_at', { withTimezone: true }).defaultNow(),
  updatedAt: timestamp('updated_at', { withTimezone: true }).defaultNow(),
});
