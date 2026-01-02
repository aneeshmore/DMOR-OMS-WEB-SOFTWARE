/**
 * Production Supervisor Repository (Consolidated Schema)
 *
 * UPDATED Dec 2024: Using batchProducts instead of batchOrders and batchSubProducts
 */

import { db } from '../../db/index.js';
import {
  productionBatch,
  batchProducts,
  batchMaterials,
  orders,
  products,
  masterProducts,
  employees,
  customers,
} from '../../db/schema/index.js';
import { eq, and, desc, inArray, isNotNull } from 'drizzle-orm';

export class ProductionSupervisorRepository {
  async findBySupervisor(supervisorId, status) {
    const conditions = [];

    // Only filter by supervisorId if provided (for specific supervisor view)
    if (supervisorId) {
      conditions.push(eq(productionBatch.supervisorId, supervisorId));
    }

    if (status) {
      conditions.push(eq(productionBatch.status, status));
    }

    // Query with product join to get product details
    const query = db
      .select({
        batch: productionBatch,
        product: masterProducts,
        supervisor: employees,
      })
      .from(productionBatch)
      .leftJoin(masterProducts, eq(productionBatch.masterProductId, masterProducts.masterProductId))
      .leftJoin(employees, eq(productionBatch.supervisorId, employees.employeeId))
      .orderBy(desc(productionBatch.scheduledDate), desc(productionBatch.batchId));

    if (conditions.length > 0) {
      query.where(and(...conditions));
    }

    const batches = await query;

    // Fetch batch products (orders + SKUs) for these batches
    if (batches.length > 0) {
      const batchIds = batches.map(b => b.batch.batchId);

      // Get all batch products with their order and product details
      const relatedBatchProducts = await db
        .select({
          batchId: batchProducts.batchId,
          batchProduct: batchProducts,
          order: orders,
          product: products,
          customer: customers,
        })
        .from(batchProducts)
        .leftJoin(orders, eq(batchProducts.orderId, orders.orderId))
        .leftJoin(customers, eq(orders.customerId, customers.customerId))
        .leftJoin(products, eq(batchProducts.productId, products.productId))
        .where(inArray(batchProducts.batchId, batchIds));

      // Attach orders and products to batches
      batches.forEach(item => {
        const batchRelated = relatedBatchProducts.filter(bp => bp.batchId === item.batch.batchId);

        // Extract unique orders
        const uniqueOrders = new Map();
        batchRelated.forEach(bp => {
          if (bp.order && !uniqueOrders.has(bp.order.orderId)) {
            uniqueOrders.set(bp.order.orderId, {
              ...bp.order,
              quantity: bp.batchProduct.plannedUnits,
              customer: bp.customer,
            });
          }
        });
        item.orders = Array.from(uniqueOrders.values());

        // Extract products (SKUs)
        item.subProducts = batchRelated
          .filter(bp => bp.product)
          .map(bp => ({
            ...bp.product,
            plannedUnits: bp.batchProduct.plannedUnits,
            producedUnits: bp.batchProduct.producedUnits,
            isFulfilled: bp.batchProduct.isFulfilled,
          }));

        // Determine batch type
        item.batchType = item.orders.length > 0 ? 'MAKE_TO_ORDER' : 'MAKE_TO_STOCK';
      });
    }

    return batches;
  }

  async findBatchWithDetails(batchId) {
    // Get batch
    const [batch] = await db
      .select()
      .from(productionBatch)
      .where(eq(productionBatch.batchId, batchId));

    if (!batch) return null;

    // Get materials
    const materials = await db
      .select({
        batchMaterial: batchMaterials,
        material: products,
      })
      .from(batchMaterials)
      .leftJoin(products, eq(batchMaterials.materialId, products.productId))
      .where(eq(batchMaterials.batchId, batchId));

    // Get batch products (combines old batchOrders and batchSubProducts)
    const batchProductsList = await db
      .select({
        batchProduct: batchProducts,
        order: orders,
        product: products,
        customer: customers,
      })
      .from(batchProducts)
      .leftJoin(orders, eq(batchProducts.orderId, orders.orderId))
      .leftJoin(customers, eq(orders.customerId, customers.customerId))
      .leftJoin(products, eq(batchProducts.productId, products.productId))
      .where(eq(batchProducts.batchId, batchId));

    // Get supervisor details
    let supervisor = null;
    if (batch.supervisorId) {
      [supervisor] = await db
        .select()
        .from(employees)
        .where(eq(employees.employeeId, batch.supervisorId));
    }

    // Get master product details
    let masterProduct = null;
    if (batch.masterProductId) {
      [masterProduct] = await db
        .select()
        .from(masterProducts)
        .where(eq(masterProducts.masterProductId, batch.masterProductId));
    }

    return {
      ...batch,
      materials,
      batchProducts: batchProductsList,
      // Legacy compatibility
      orders: batchProductsList
        .filter(bp => bp.order)
        .map(bp => ({
          batchProduct: bp.batchProduct,
          order: bp.order,
        })),
      subProducts: batchProductsList.map(bp => ({
        subProduct: bp.batchProduct,
        product: bp.product,
      })),
      supervisor,
      masterProduct,
    };
  }
}
