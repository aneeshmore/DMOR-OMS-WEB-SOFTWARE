/**
 * Batch Materials Table
 *
 * Tracks raw materials required for and consumed by each production batch.
 * Records both planned requirements (from BOM) and actual consumption.
 * Used for material availability checking and inventory deduction.
 */

import { serial, integer, numeric, timestamp, boolean } from 'drizzle-orm/pg-core';
import { appSchema } from '../core/app-schema.js';
import { productionBatch } from './production-batch.js';
import { masterProducts } from '../products/master-products.js';

export const batchMaterials = appSchema.table('batch_materials', {
  batchMaterialId: serial('batch_material_id').primaryKey(),

  batchId: integer('batch_id')
    .notNull()
    .references(() => productionBatch.batchId, { onDelete: 'cascade' }),

  materialId: integer('material_id')
    .notNull()
    .references(() => masterProducts.masterProductId), // Raw material master product

  sequence: integer('sequence').default(0),
  waitingTime: integer('waiting_time').default(0),
  isAdditional: boolean('is_additional').default(false),

  // Planned (from BOM calculation)
  requiredQuantity: numeric('required_quantity', { precision: 18, scale: 4 }).notNull(),
  requiredUsePer: numeric('required_use_per', { precision: 18, scale: 4 }),
  requiredUseQty: numeric('required_use_qty', { precision: 18, scale: 4 }),

  // Note: actualQuantity and variance columns removed
  // Users must use exactly the planned quantity, no variance tracking needed

  createdAt: timestamp('created_at', { withTimezone: true }).defaultNow(),
});
