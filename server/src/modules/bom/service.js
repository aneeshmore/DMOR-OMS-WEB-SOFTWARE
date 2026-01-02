import { BOMRepository } from './repository.js';
import { BOMDTO } from './dto.js';
import { AppError } from '../../utils/AppError.js';
import { MasterProductsService } from '../master-products/service.js';

export class BOMService {
  constructor() {
    this.repository = new BOMRepository();
    this.masterProductsService = new MasterProductsService();
  }

  async getFinishedGoods() {
    // Get all FG products (not master products, but actual products)
    const bomItems = await this.repository.getAllFinishedGoods();
    return bomItems;
  }

  async calculateBOMRequirements(finishedGoodId, productionQuantity) {
    const bomItems = await this.repository.findByFinishedGood(finishedGoodId);

    if (bomItems.length === 0) {
      console.log(`[BOMService] No BOM configured for product ${finishedGoodId}`);
      return [];
    }

    const requirements = bomItems.map(item => {
      // Percentage is stored as decimal (0.15 for 15%), so multiply directly
      const percentage = parseFloat(item.bom.percentage);
      const requiredQty = productionQuantity * percentage;
      const availableQty = parseFloat(item.rawMaterial.availableQuantity || 0);

      let status = 'Sufficient';
      if (availableQty < requiredQty) {
        status = 'Critical';
      } else if (availableQty < requiredQty * 1.2) {
        status = 'Low Stock';
      }

      return {
        RawMaterialID: item.rawMaterial.productId,
        RawMaterialName: item.rawMaterial.productName,
        RequiredQty: requiredQty,
        AvailableQty: availableQty,
        Unit: 'KG', // TODO: Get from unit table
        Status: status,
      };
    });

    const criticalCount = requirements.filter(r => r.Status === 'Critical').length;
    if (criticalCount > 0) {
      console.log(
        `[BOMService] Product ${finishedGoodId}: ${criticalCount}/${requirements.length} materials CRITICAL`
      );
    }

    return requirements;
  }

  async getBOMByFinishedGood(finishedGoodId) {
    const bomItems = await this.repository.findByFinishedGood(finishedGoodId);
    return bomItems.map(item => new BOMDTO(item.bom));
  }

  async createBOM(bomData) {
    const bom = await this.repository.create(bomData);
    return new BOMDTO(bom);
  }

  async updateBOM(bomId, updateData) {
    const existing = await this.repository.findById(bomId);
    if (!existing) {
      throw new AppError('BOM entry not found', 404);
    }

    const updated = await this.repository.update(bomId, updateData);
    return new BOMDTO(updated);
  }

  async deleteBOM(bomId) {
    const existing = await this.repository.findById(bomId);
    if (!existing) {
      throw new AppError('BOM entry not found', 404);
    }

    await this.repository.delete(bomId);
  }

  async replaceBOM(finishedGoodId, bomItems) {
    // Delete existing BOM
    await this.repository.deleteByFinishedGood(finishedGoodId);

    // Create new BOM entries
    const results = [];
    for (const item of bomItems) {
      const bom = await this.repository.create({
        finishedGoodId,
        rawMaterialId: item.rawMaterialId,
        percentage: item.percentage,
      });
      results.push(new BOMDTO(bom));
    }

    return results;
  }
}
