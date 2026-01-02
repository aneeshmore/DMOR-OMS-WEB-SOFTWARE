/**
 * Product Relations
 *
 * Defines all relationships between product-related tables.
 */

import { relations } from 'drizzle-orm';
import { masterProducts } from './master-products.js';
import { masterProductFG } from './master-product-fg.js';
import { masterProductRM } from './master-product-rm.js';
import { masterProductPM } from './master-product-pm.js';
import { products } from './products.js';
import { productBom } from './product-bom.js';

// Master Products Relations
export const masterProductsRelations = relations(masterProducts, ({ one, many }) => ({
  fgDetails: one(masterProductFG, {
    fields: [masterProducts.masterProductId],
    references: [masterProductFG.masterProductId],
  }),

  rmDetails: one(masterProductRM, {
    fields: [masterProducts.masterProductId],
    references: [masterProductRM.masterProductId],
  }),

  pmDetails: one(masterProductPM, {
    fields: [masterProducts.masterProductId],
    references: [masterProductPM.masterProductId],
  }),

  skuProducts: many(products, { relationName: 'masterProductSkus' }),
}));

// FG Subtype Relations
export const masterProductFGRelations = relations(masterProductFG, ({ one }) => ({
  master: one(masterProducts, {
    fields: [masterProductFG.masterProductId],
    references: [masterProducts.masterProductId],
  }),
}));

// RM Subtype Relations
export const masterProductRMRelations = relations(masterProductRM, ({ one }) => ({
  master: one(masterProducts, {
    fields: [masterProductRM.masterProductId],
    references: [masterProducts.masterProductId],
  }),
}));

// PM Subtype Relations
export const masterProductPMRelations = relations(masterProductPM, ({ one }) => ({
  master: one(masterProducts, {
    fields: [masterProductPM.masterProductId],
    references: [masterProducts.masterProductId],
  }),
}));

// SKU / Products Relations
export const productsRelations = relations(products, ({ one }) => ({
  masterProduct: one(masterProducts, {
    fields: [products.masterProductId],
    references: [masterProducts.masterProductId],
    relationName: 'masterProductSkus',
  }),
  packaging: one(masterProducts, {
    fields: [products.packagingId],
    references: [masterProducts.masterProductId],
    relationName: 'packaging',
  }),
}));

// Product BOM Relations
export const productBomRelations = relations(productBom, ({ one }) => ({
  finishedGood: one(products, {
    fields: [productBom.finishedGoodId],
    references: [products.productId],
    relationName: 'finishedGood',
  }),
  rawMaterial: one(products, {
    fields: [productBom.rawMaterialId],
    references: [products.productId],
    relationName: 'rawMaterial',
  }),
}));
