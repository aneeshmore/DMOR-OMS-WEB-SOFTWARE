/**
 * Products (SKU) Schema
 *
 * SKU-level products representing specific sellable items.
 * Links to master products and contains pricing, inventory, and sales data.
 * Primarily used for Finished Goods SKUs.
 */

import { serial, uuid, integer, varchar, numeric, boolean, timestamp } from 'drizzle-orm/pg-core';
import { appSchema } from '../core/app-schema.js';
import { masterProducts } from './master-products.js';

export const products = appSchema.table('products', {
  productId: serial('product_id').primaryKey(),
  productUuid: uuid('product_uuid').defaultRandom().notNull(),

  masterProductId: integer('master_product_id')
    .notNull()
    .references(() => masterProducts.masterProductId, { onDelete: 'cascade' }),

  packagingId: integer('packaging_id').references(() => masterProducts.masterProductId, {
    onDelete: 'set null',
  }),

  productName: varchar('product_name', { length: 255 }).notNull(),
  sellingPrice: numeric('selling_price', {
    precision: 12,
    scale: 3,
  })
    .notNull()
    .default('0'),
  availableQuantity: numeric('available_quantity', { precision: 18, scale: 4 }).default('0'),
  reservedQuantity: numeric('reserved_quantity', { precision: 18, scale: 4 }).default('0'), // Quantity reserved for ongoing batches or confirmed orders
  availableWeightKg: numeric('available_weight_kg', {
    precision: 18,
    scale: 4,
  }).default('0'), // Total weight available in kg
  reservedWeightKg: numeric('reserved_weight_kg', {
    precision: 18,
    scale: 4,
  }).default('0'), // Weight reserved for confirmed orders
  packageCapacityKg: numeric('package_capacity_kg', {
    precision: 12,
    scale: 4,
  }), // Weight capacity per package in kg (PM Capacity × FG Density)
  minStockLevel: integer('min_stock_level').default(0),

  // Packaging capacity is now dynamically fetched from packaging_id -> master_product_pm.capacity
  // Package Weight Capacity is calculated dynamically: PM Capacity * FG Density

  // Filling Density fields
  fillingDensity: numeric('filling_density', {
    precision: 12,
    scale: 4,
  }), // Editable density value for filling calculations

  isFdSyncWithDensity: boolean('is_fd_sync_with_density').default(true), // If TRUE, filling density syncs with master density

  incentiveAmount: numeric('incentive_amount', {
    precision: 12,
    scale: 3,
  }).default('0'),

  isActive: boolean('is_active').notNull().default(true),
  createdAt: timestamp('created_at', { withTimezone: true }).defaultNow(),
  updatedAt: timestamp('updated_at', { withTimezone: true }).defaultNow(),
});
