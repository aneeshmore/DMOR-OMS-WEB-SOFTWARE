/**
 * Inventory Availability Service
 *
 * Provides weight-based and capacity-based inventory checking
 * Calculates direct and indirect availability
 */

import { eq, sql } from 'drizzle-orm';
import db from '../../db/index.js';
import { products, batchProducts } from '../../db/schema/index.js';

export class InventoryAvailabilityService {
  /**
   * Get availability status for a product (SKU)
   * @param {number} productId - SKU product ID
   * @returns {Object} Availability details with direct and indirect options
   */
  async getProductAvailability(productId) {
    const [product] = await db.select().from(products).where(eq(products.productId, productId));

    if (!product) {
      throw new Error('Product not found');
    }

    const availableQty = parseFloat(product.availableQuantity || 0);
    const reservedQty = parseFloat(product.reservedQuantity || 0);
    const availableWeightKg = parseFloat(product.availableWeightKg || 0);
    const reservedWeightKg = parseFloat(product.reservedWeightKg || 0);
    const packageCapacity = parseFloat(product.packageCapacityKg || 0);

    return {
      productId,
      productName: product.productName,
      packageCapacityKg: packageCapacity,
      // Direct availability (in exact capacity)
      direct: {
        availableQuantity: availableQty,
        availableWeightKg,
        availablePackages:
          packageCapacity > 0 ? Math.floor(availableWeightKg / packageCapacity) : 0,
        percentageFilled:
          packageCapacity > 0 ? ((availableWeightKg % packageCapacity) / packageCapacity) * 100 : 0,
      },
      // Total availability including reserved
      total: {
        totalQuantity: availableQty + reservedQty,
        totalWeightKg: availableWeightKg + reservedWeightKg,
      },
      // Reserved for confirmed orders
      reserved: {
        reservedQuantity: reservedQty,
        reservedWeightKg,
      },
      // Net available (available - reserved)
      net: {
        netQuantity: Math.max(availableQty - reservedQty, 0),
        netWeightKg: Math.max(availableWeightKg - reservedWeightKg, 0),
      },
    };
  }

  /**
   * Check if inventory can fulfill an order
   * @param {number} productId - SKU to check
   * @param {number} requiredWeightKg - Weight needed
   * @returns {Object} Fulfillment status with availability breakdown
   */
  async checkFulfillmentCapability(productId, requiredWeightKg) {
    const availability = await this.getProductAvailability(productId);
    const available = availability.direct.availableWeightKg;

    if (available >= requiredWeightKg) {
      return {
        canFulfill: true,
        availabilityType: 'DIRECT',
        description: 'Available in exact capacity',
        availableWeightKg: available,
        surplusKg: available - requiredWeightKg,
        packageSplit: this._calculatePackageSplit(
          available,
          requiredWeightKg,
          availability.packageCapacityKg
        ),
      };
    } else if (available > 0) {
      return {
        canFulfill: false,
        availabilityType: 'INDIRECT',
        description: 'Available but in different capacities/partial',
        availableWeightKg: available,
        shortfallKg: requiredWeightKg - available,
        packageSplit: this._calculatePackageSplit(
          available,
          requiredWeightKg,
          availability.packageCapacityKg
        ),
        suggestions: this._getSuggestions(productId, requiredWeightKg, available),
      };
    } else {
      return {
        canFulfill: false,
        availabilityType: 'NOT_AVAILABLE',
        description: 'No stock available',
        availableWeightKg: 0,
        shortfallKg: requiredWeightKg,
        packageSplit: [],
      };
    }
  }

  /**
   * Get all available SKU capacities for a master product
   * Useful for fulfilling orders with alternative package sizes
   */
  async getAlternativeCapacities(masterProductId) {
    const skus = await db
      .select({
        productId: products.productId,
        productName: products.productName,
        packageCapacityKg: products.packageCapacityKg,
        availableWeightKg: products.availableWeightKg,
        availableQuantity: products.availableQuantity,
      })
      .from(products)
      .where(eq(products.masterProductId, masterProductId));

    return skus
      .filter(sku => parseFloat(sku.availableWeightKg || 0) > 0)
      .map(sku => ({
        ...sku,
        availablePackages:
          parseFloat(sku.packageCapacityKg || 0) > 0
            ? Math.floor(parseFloat(sku.availableWeightKg) / parseFloat(sku.packageCapacityKg))
            : 0,
      }));
  }

  /**
   * Validate batch distribution against inventory
   * @param {number} batchId - Production batch
   * @returns {Object} Validation result
   */
  async validateBatchDistributions(batchId) {
    const batchProductsList = await db
      .select()
      .from(batchProducts)
      .where(eq(batchProducts.batchId, batchId));

    if (batchProductsList.length === 0) {
      return {
        valid: false,
        message: 'No batch products found for batch',
      };
    }

    const validationResults = [];

    for (const batchProduct of batchProductsList) {
      const [product] = await db
        .select()
        .from(products)
        .where(eq(products.productId, batchProduct.productId));

      if (!product) {
        validationResults.push({
          batchProductId: batchProduct.batchProductId,
          valid: false,
          error: 'Product not found',
        });
        continue;
      }

      const requiredWeight = parseFloat(
        batchProduct.producedWeightKg || batchProduct.plannedWeightKg || 0
      );
      const available = parseFloat(product.availableWeightKg || 0);

      validationResults.push({
        batchProductId: batchProduct.batchProductId,
        orderId: batchProduct.orderId,
        productId: batchProduct.productId,
        valid: available >= requiredWeight,
        requiredWeightKg: requiredWeight,
        availableWeightKg: available,
        status: available >= requiredWeight ? 'FULFILLED' : 'INSUFFICIENT',
      });
    }

    return {
      valid: validationResults.every(v => v.valid),
      batchProducts: validationResults,
      totalValid: validationResults.filter(v => v.valid).length,
      totalInvalid: validationResults.filter(v => !v.valid).length,
    };
  }

  /**
   * Calculate how to split available weight into packages
   */
  _calculatePackageSplit(availableWeightKg, requiredWeightKg, capacityKg) {
    if (capacityKg <= 0) return [];

    const availablePackages = Math.floor(availableWeightKg / capacityKg);
    const partialWeightKg = availableWeightKg % capacityKg;

    const split = [];
    if (availablePackages > 0) {
      split.push({
        packageCount: availablePackages,
        capacityKg,
        totalWeightKg: availablePackages * capacityKg,
        type: 'FULL',
      });
    }

    if (partialWeightKg > 0) {
      split.push({
        packageCount: 1,
        capacityKg: partialWeightKg,
        totalWeightKg: partialWeightKg,
        type: 'PARTIAL',
      });
    }

    return split;
  }

  /**
   * Get suggestions for fulfilling with alternative capacities
   */
  async _getSuggestions(productId, requiredWeightKg, currentlyAvailable) {
    const [product] = await db.select().from(products).where(eq(products.productId, productId));

    if (!product) return [];

    const alternatives = await this.getAlternativeCapacities(product.masterProductId);

    return alternatives
      .filter(alt => alt.productId !== productId) // Exclude current product
      .map(alt => ({
        productId: alt.productId,
        productName: alt.productName,
        capacityKg: alt.packageCapacityKg,
        availableWeightKg: alt.availableWeightKg,
        canSupplyShortfall:
          parseFloat(alt.availableWeightKg) >= requiredWeightKg - currentlyAvailable,
      }))
      .filter(alt => alt.canSupplyShortfall);
  }

  /**
   * Reserve weight for confirmed order
   */
  async reserveWeight(productId, weightKg, referenceOrderId) {
    const [product] = await db.select().from(products).where(eq(products.productId, productId));

    if (!product) {
      throw new Error('Product not found');
    }

    const currentAvailable = parseFloat(product.availableWeightKg || 0);
    if (currentAvailable < weightKg) {
      throw new Error(
        `Insufficient weight. Available: ${currentAvailable}kg, Required: ${weightKg}kg`
      );
    }

    // Update product with reservation
    await db
      .update(products)
      .set({
        availableWeightKg: sql`available_weight_kg - ${weightKg}`,
        reservedWeightKg: sql`reserved_weight_kg + ${weightKg}`,
      })
      .where(eq(products.productId, productId));

    return {
      productId,
      reservedWeightKg: weightKg,
      referenceOrderId,
      timestamp: new Date(),
    };
  }

  /**
   * Release reserved weight
   */
  async releaseWeight(productId, weightKg) {
    await db
      .update(products)
      .set({
        availableWeightKg: sql`available_weight_kg + ${weightKg}`,
        reservedWeightKg: sql`GREATEST(reserved_weight_kg - ${weightKg}, 0)`,
      })
      .where(eq(products.productId, productId));
  }
}
