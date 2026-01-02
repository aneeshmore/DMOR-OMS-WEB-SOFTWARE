/**
 * Order Details Schema
 *
 * Line items for orders.
 * Contains product-level details including quantities, pricing, and reservation status.
 */

import { bigserial, integer, numeric, boolean, timestamp } from 'drizzle-orm/pg-core';
import { appSchema } from '../core/app-schema.js';
import { orders } from './orders.js';

export const orderDetails = appSchema.table('order_details', {
  orderDetailId: bigserial('order_detail_id', { mode: 'number' }).primaryKey(),
  orderId: integer('order_id')
    .notNull()
    .references(() => orders.orderId, { onDelete: 'cascade' }),
  productId: integer('product_id').notNull(),
  quantity: integer('quantity').notNull(),
  unitPrice: numeric('unit_price', { precision: 14, scale: 3 }).notNull(),
  discount: numeric('discount', { precision: 5, scale: 2 }).default('0'),
  totalPrice: numeric('total_price', { precision: 20, scale: 4 }).generatedAlwaysAs(
    `(quantity * unit_price) * (1 - discount / 100)`
  ),
  reservedFg: boolean('reserved_fg').default(false),
  requiredWeightKg: numeric('required_weight_kg', { precision: 18, scale: 4 }), // Total weight needed for this order line in kg
  packageCount: integer('package_count'), // Number of packages needed
  createdAt: timestamp('created_at', { withTimezone: true }).defaultNow(),
  updatedAt: timestamp('updated_at', { withTimezone: true }).defaultNow(),
});
