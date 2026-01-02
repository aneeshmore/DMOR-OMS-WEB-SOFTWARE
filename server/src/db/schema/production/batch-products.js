/**
 * Batch Products Table (Consolidated)
 *
 * Links production batches to products (SKUs) and optionally to orders.
 * Replaces the old batch_orders and batch_sub_products tables.
 *
 * Supports both:
 * - Make-to-Order: orderId is set, linked to customer order
 * - Make-to-Stock: orderId is NULL, produces for inventory
 *
 * Note: One order can span multiple batches (when order has multiple master products)
 * Note: One batch always fully covers a product line item (no partial fulfillment across batches)
 */

import { serial, integer, numeric, varchar, boolean, timestamp } from 'drizzle-orm/pg-core';
import { appSchema } from '../core/app-schema.js';
import { productionBatch } from './production-batch.js';
import { orders } from '../sales/orders.js';
import { orderDetails } from '../sales/order-details.js';
import { products } from '../products/products.js';

export const batchProducts = appSchema.table('batch_products', {
  batchProductId: serial('batch_product_id').primaryKey(),

  // Core References
  batchId: integer('batch_id')
    .notNull()
    .references(() => productionBatch.batchId, { onDelete: 'cascade' }),

  productId: integer('product_id')
    .notNull()
    .references(() => products.productId), // The SKU (e.g., "Premium White 20L")

  // Order References (NULLABLE for Make-to-Stock)
  orderId: integer('order_id').references(() => orders.orderId, { onDelete: 'cascade' }), // NULL = Make-to-Stock

  orderDetailId: integer('order_detail_id').references(() => orderDetails.orderDetailId, {
    onDelete: 'cascade',
  }), // Specific line item

  // Planning (set during batch scheduling)
  plannedUnits: integer('planned_units').notNull(), // How many packages/units
  packageCapacityKg: numeric('package_capacity_kg', { precision: 12, scale: 4 }), // Weight per package
  plannedWeightKg: numeric('planned_weight_kg', { precision: 18, scale: 4 }), // plannedUnits × packageCapacityKg

  // Production (set during/after batch completion)
  producedUnits: integer('produced_units'), // Actually produced
  producedWeightKg: numeric('produced_weight_kg', { precision: 18, scale: 4 }),
  variance: numeric('variance', { precision: 18, scale: 4 }), // produced - planned

  // Fulfillment
  fulfillmentType: varchar('fulfillment_type', { length: 20 }).notNull().default('MAKE_TO_ORDER'), // 'MAKE_TO_ORDER' | 'MAKE_TO_STOCK'

  isFulfilled: boolean('is_fulfilled').default(false),
  fulfilledAt: timestamp('fulfilled_at', { withTimezone: true }),

  // Inventory Update Tracking
  inventoryUpdated: boolean('inventory_updated').default(false), // True when FG added to inventory
  inventoryUpdatedAt: timestamp('inventory_updated_at', { withTimezone: true }),

  // Audit
  createdAt: timestamp('created_at', { withTimezone: true }).defaultNow(),
  updatedAt: timestamp('updated_at', { withTimezone: true }).defaultNow(),
});
