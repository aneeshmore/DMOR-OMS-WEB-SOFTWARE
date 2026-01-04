/**
 * Inventory Transactions Table
 *
 * Complete audit trail for all inventory movements.
 * Records every stock change with full context and references.
 * Used for inventory history, reconciliation, and reporting.
 */

import { bigserial, integer, varchar, numeric, text, timestamp } from 'drizzle-orm/pg-core';
import { appSchema } from '../core/app-schema.js';
import { products } from '../products/products.js';
import { masterProducts } from '../products/master-products.js';
import { employees } from '../organization/employees.js';

export const inventoryTransactions = appSchema.table('inventory_transactions', {
  transactionId: bigserial('transaction_id', { mode: 'bigint' }).primaryKey(),

  // For FG (Finished Goods) - references the SKU in products table
  productId: integer('product_id').references(() => products.productId),

  // For RM/PM - references the master product directly (no SKUs for RM/PM)
  masterProductId: integer('master_product_id').references(() => masterProducts.masterProductId),

  transactionType: varchar('transaction_type', { length: 50 }).notNull(),
  // Values: 'Inward', 'Production Consumption', 'Production Output',
  //         'Dispatch', 'Adjustment', 'Return', 'Discard'

  quantity: integer('quantity').notNull(), // Can be negative for consumption

  weightKg: numeric('weight_kg', { precision: 18, scale: 4 }), // Weight moved in kg
  densityKgPerL: numeric('density_kg_per_l', { precision: 12, scale: 6 }), // Density of the product (for reference)

  balanceBefore: integer('balance_before'),
  balanceAfter: integer('balance_after'),

  referenceType: varchar('reference_type', { length: 50 }),
  // Values: 'Batch', 'Order', 'Inward', 'Dispatch', 'Manual Adjustment'

  referenceId: integer('reference_id'),

  unitPrice: numeric('unit_price', { precision: 14, scale: 4 }), // Cost per unit
  totalValue: numeric('total_value', { precision: 20, scale: 4 }), // quantity * unitPrice

  notes: text('notes'),

  createdBy: integer('created_by')
    .notNull()
    .references(() => employees.employeeId),

  createdAt: timestamp('created_at', { withTimezone: true }).defaultNow(),
});
