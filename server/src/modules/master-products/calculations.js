/**
 * Master Product Calculations
 *
 * Utilities for calculating FG density and RM cost based on BOM composition
 */

import { db } from '../../db/index.js';
import {
  products,
  productBom,
  masterProducts,
  masterProductRM,
  masterProductFG,
} from '../../db/schema/index.js';
import { eq, inArray } from 'drizzle-orm';

/**
 * Calculate Production Cost (prev RM Cost) for a Finished Good based on its BOM
 *
 * Formula: rmCost = Σ(RM_unit_price × BOM_percentage)
 *
 * @param {number} finishedGoodId - Product ID of the finished good
 * @returns {Promise<{rmCost: number, fgDensity: number, breakdown: Array}>}
 */
export async function calculateRMCostFromBOM(finishedGoodId) {
  try {
    // 1. Get BOM for this finished good
    const bomItems = await db
      .select({
        rawMaterialId: productBom.rawMaterialId,
        percentage: productBom.percentage,
        notes: productBom.notes,
      })
      .from(productBom)
      .where(eq(productBom.finishedGoodId, finishedGoodId));

    if (bomItems.length === 0) {
      return {
        productionCost: 0,
        fgDensity: 0,
        breakdown: [],
        message: 'No BOM found for this product',
      };
    }

    // 2. Get raw material details (prices, package quantities, densities)
    const rawMaterialIds = bomItems.map(item => item.rawMaterialId);

    const rawMaterials = await db
      .select({
        productId: products.productId,
        productName: products.productName,
        sellingPrice: products.sellingPrice,
        packageCapacityKg: products.packageCapacityKg,
        masterProductId: products.masterProductId,
      })
      .from(products)
      .where(inArray(products.productId, rawMaterialIds));

    // 3. Get RM densities from master_product_rm
    const masterProductIds = rawMaterials.map(rm => rm.masterProductId);
    const rmDensities = await db
      .select({
        masterProductId: masterProductRM.masterProductId,
        rmDensity: masterProductRM.rmDensity,
        rmSolids: masterProductRM.rmSolids,
      })
      .from(masterProductRM)
      .where(inArray(masterProductRM.masterProductId, masterProductIds));

    // Create a map for easy lookup
    const densityMap = {};
    rmDensities.forEach(rm => {
      densityMap[rm.masterProductId] = {
        density: parseFloat(rm.rmDensity || 1.0),
        solids: parseFloat(rm.rmSolids || 100),
      };
    });

    // 4. Calculate cost breakdown
    let totalRMCost = 0;
    let totalWeightedDensity = 0;
    const breakdown = [];

    for (const bomItem of bomItems) {
      const rm = rawMaterials.find(r => r.productId === bomItem.rawMaterialId);
      if (!rm) continue;

      const percentage = parseFloat(bomItem.percentage);
      const sellingPrice = parseFloat(rm.sellingPrice);
      const packageQty = parseFloat(rm.packageCapacityKg || 1);

      // Unit price (price per liter/kg)
      const unitPrice = sellingPrice / packageQty;

      // Cost contribution for this RM
      const costContribution = unitPrice * percentage;

      // Get density for this RM
      const rmInfo = densityMap[rm.masterProductId] || { density: 1.0, solids: 100 };
      const density = rmInfo.density;

      // Weighted density contribution
      const densityContribution = density * percentage;

      totalRMCost += costContribution;
      totalWeightedDensity += densityContribution;

      breakdown.push({
        rawMaterial: rm.productName,
        percentage: (percentage * 100).toFixed(2) + '%',
        unitPrice: unitPrice.toFixed(2),
        costContribution: costContribution.toFixed(2),
        density: density.toFixed(2),
        notes: bomItem.notes,
      });
    }

    return {
      productionCost: parseFloat(totalRMCost.toFixed(2)),
      fgDensity: parseFloat(totalWeightedDensity.toFixed(2)),
      breakdown,
      message: 'Calculated successfully',
    };
  } catch (error) {
    console.error('Error calculating RM cost:', error);
    throw error;
  }
}

/**
 * Recalculate and update Production Cost for all FG products
 * Run this when RM prices change
 *
 * @returns {Promise<Array>} Updated products with new costs
 */
export async function recalculateAllRMCosts() {
  try {
    // Get all finished goods that have BOM
    const fgProducts = await db
      .select({
        productId: products.productId,
        productName: products.productName,
        masterProductId: products.masterProductId,
      })
      .from(products)
      .innerJoin(masterProducts, eq(products.masterProductId, masterProducts.masterProductId))
      .where(eq(masterProducts.productType, 'FG'));

    const results = [];

    for (const fg of fgProducts) {
      const calculation = await calculateRMCostFromBOM(fg.productId);

      if (calculation.productionCost > 0) {
        // Update master_product_fg with new values
        await db
          .update(masterProductFG)
          .set({
            productionCost: calculation.productionCost.toString(),
            fgDensity: calculation.fgDensity.toString(),
          })
          .where(eq(masterProductFG.masterProductId, fg.masterProductId));

        results.push({
          productName: fg.productName,
          productionCost: calculation.productionCost,
          fgDensity: calculation.fgDensity,
          breakdown: calculation.breakdown,
        });
      }
    }

    return results;
  } catch (error) {
    console.error('Error recalculating RM costs:', error);
    throw error;
  }
}

/**
 * Calculate selling price suggestion based on RM cost and margin
 *
 * @param {number} rmCost - Raw material cost
 * @param {number} marginPercentage - Desired profit margin (default 35%)
 * @param {number} packagingCost - Cost of packaging material
 * @param {number} overheadPercentage - Manufacturing overhead (default 15%)
 * @returns {Object} Pricing breakdown
 */
export function calculateSellingPrice(
  rmCost,
  marginPercentage = 35,
  packagingCost = 0,
  overheadPercentage = 15
) {
  const overhead = rmCost * (overheadPercentage / 100);
  const totalCost = rmCost + packagingCost + overhead;
  const margin = totalCost * (marginPercentage / 100);
  const sellingPrice = totalCost + margin;

  return {
    rmCost: parseFloat(rmCost.toFixed(2)),
    packagingCost: parseFloat(packagingCost.toFixed(2)),
    overhead: parseFloat(overhead.toFixed(2)),
    totalCost: parseFloat(totalCost.toFixed(2)),
    margin: parseFloat(margin.toFixed(2)),
    marginPercentage,
    sellingPrice: parseFloat(sellingPrice.toFixed(2)),
  };
}
