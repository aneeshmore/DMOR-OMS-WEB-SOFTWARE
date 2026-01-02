/**
 * Cross-Domain Relations
 *
 * Defines relationships that span across multiple schema domains.
 * This file connects tables from different modules (e.g., employees with customers,
 * products with orders, etc.) to maintain referential integrity across the system.
 *
 * Note: Import this file after all individual domain schemas to ensure
 * all table definitions are available.
 *
 * UPDATED Dec 2024: Using consolidated batchProducts instead of batchOrders/batchSubProducts
 */

import { relations } from 'drizzle-orm';

// Import tables from different domains
import { employees } from './organization/employees.js';
import { customers } from './sales/customers.js';
import { orders } from './sales/orders.js';
import { orderDetails } from './sales/order-details.js';
import { products } from './products/products.js';
import { masterProducts } from './products/master-products.js';
import { productionBatch } from './production/production-batch.js';
import { batchProducts } from './production/batch-products.js';
import { materialInward } from './inventory/material-inward.js';
import { materialDiscard } from './inventory/material-discard.js';
import { stockLedger } from './inventory/stock-ledger.js';
import { employeeRoles } from './auth/employee-roles.js';

/**
 * Extended Employee Relations
 * Adds cross-domain relationships to employees
 */
export const employeesExtendedRelations = relations(employees, ({ many }) => ({
  employeeRoles: many(employeeRoles),
  productionBatches: many(productionBatch),
  customersAsSalesPerson: many(customers),
  ordersAsSalesPerson: many(orders),
}));

/**
 * Extended Customer Relations
 * Adds employee (salesperson) relationship
 */
export const customersExtendedRelations = relations(customers, ({ one }) => ({
  salesPerson: one(employees, {
    fields: [customers.salesPersonId],
    references: [employees.employeeId],
  }),
}));

/**
 * Extended Order Details Relations
 * Adds product relationship
 */
export const orderDetailsExtendedRelations = relations(orderDetails, ({ one }) => ({
  product: one(products, {
    fields: [orderDetails.productId],
    references: [products.productId],
  }),
}));

/**
 * Extended Production Batch Relations
 * Adds relationships to products, supervisors, and batch products
 */
export const productionBatchExtendedRelations = relations(productionBatch, ({ one, many }) => ({
  masterProduct: one(masterProducts, {
    fields: [productionBatch.masterProductId],
    references: [masterProducts.masterProductId],
  }),
  supervisor: one(employees, {
    fields: [productionBatch.supervisorId],
    references: [employees.employeeId],
  }),
  batchProducts: many(batchProducts),
}));

/**
 * Batch Products Relations (Consolidated)
 * Links batch products to orders, production batches, and products
 */
export const batchProductsRelations = relations(batchProducts, ({ one }) => ({
  order: one(orders, {
    fields: [batchProducts.orderId],
    references: [orders.orderId],
  }),
  productionBatch: one(productionBatch, {
    fields: [batchProducts.batchId],
    references: [productionBatch.batchId],
  }),
  product: one(products, {
    fields: [batchProducts.productId],
    references: [products.productId],
  }),
  orderDetail: one(orderDetails, {
    fields: [batchProducts.orderDetailId],
    references: [orderDetails.orderDetailId],
  }),
}));

/**
 * Extended Material Inward Relations
 * Adds master product relationship
 */
export const materialInwardExtendedRelations = relations(materialInward, ({ one }) => ({
  masterProduct: one(masterProducts, {
    fields: [materialInward.masterProductId],
    references: [masterProducts.masterProductId],
  }),
}));

/**
 * Extended Material Discard Relations
 * Adds product relationship
 */
export const materialDiscardExtendedRelations = relations(materialDiscard, ({ one }) => ({
  product: one(products, {
    fields: [materialDiscard.productId],
    references: [products.productId],
  }),
}));

/**
 * Extended Stock Ledger Relations
 * Adds product and employee relationships
 */
export const stockLedgerExtendedRelations = relations(stockLedger, ({ one }) => ({
  product: one(products, {
    fields: [stockLedger.productId],
    references: [products.productId],
  }),
  employee: one(employees, {
    fields: [stockLedger.createdBy],
    references: [employees.employeeId],
  }),
}));

/**
 * Extended Employee Roles Relations
 * Adds employee relationship
 */
export const employeeRolesExtendedRelations = relations(employeeRoles, ({ one }) => ({
  employee: one(employees, {
    fields: [employeeRoles.employeeId],
    references: [employees.employeeId],
  }),
}));
