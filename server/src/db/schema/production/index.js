/**
 * Production Schema Exports
 *
 * Central export point for all production-related schema definitions.
 *
 * CONSOLIDATED SCHEMA (Dec 2024):
 * - batch_products replaces batch_orders, batch_sub_products, and production_batch_distributions
 * - Supports both Make-to-Order and Make-to-Stock
 */

export * from './production-batch.js';
export * from './batch-products.js'; // NEW: Consolidated table
export * from './batch-materials.js';
export * from './batch-activity-log.js';

// DEPRECATED - Kept for reference, will be removed after migration
// export * from './batch-orders.js';
// export * from './batch-sub-products.js';
// export * from './production-batch-distributions.js';
// export * from './relations.js';
