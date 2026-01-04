/**
 * Inventory Relations
 *
 * Defines relationships for inventory-related tables.
 */

import { relations } from 'drizzle-orm';
import { suppliers } from './suppliers.js';
import { materialInward } from './material-inward.js';
import { materialDiscard } from './material-discard.js';
import { stockLedger } from './stock-ledger.js';
import { inventoryTransactions } from './inventory-transactions.js';
import { products } from '../products/products.js';
import { masterProducts } from '../products/master-products.js';
import { employees } from '../organization/employees.js';

// Suppliers Relations
export const suppliersRelations = relations(suppliers, ({ many, one: _one }) => ({
  materialInwards: many(materialInward),
}));

// Material Inward Relations
export const materialInwardRelations = relations(materialInward, ({ one: _one }) => ({
  supplier: _one(suppliers, {
    fields: [materialInward.supplierId],
    references: [suppliers.supplierId],
  }),
}));

// Material Discard Relations
export const materialDiscardRelations = relations(materialDiscard, ({ one }) => ({}));

// Stock Ledger Relations
export const stockLedgerRelations = relations(stockLedger, ({ one }) => ({}));

// Inventory Transactions Relations
export const inventoryTransactionsRelations = relations(inventoryTransactions, ({ one }) => ({
  // For FG - links to SKU in products table
  product: one(products, {
    fields: [inventoryTransactions.productId],
    references: [products.productId],
  }),
  // For RM/PM - links directly to master_products table
  masterProduct: one(masterProducts, {
    fields: [inventoryTransactions.masterProductId],
    references: [masterProducts.masterProductId],
  }),
  createdByEmployee: one(employees, {
    fields: [inventoryTransactions.createdBy],
    references: [employees.employeeId],
  }),
}));
