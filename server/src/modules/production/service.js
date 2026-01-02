import { ProductionRepository } from './repository.js';
import { ProductionBatchDTO } from './dto.js';
import { AppError } from '../../utils/AppError.js';

import { InventoryService } from '../inventory/service.js';
import { NotificationsService } from '../notifications/service.js';

export class ProductionService {
  constructor() {
    this.repository = new ProductionRepository();
    this.inventoryService = new InventoryService();
    this.notificationsService = new NotificationsService();
  }

  async getAllBatches(filters) {
    const batches = await this.repository.findAll(filters);
    return batches.map(b => new ProductionBatchDTO(b.production_batch));
  }

  async getBatchById(batchId) {
    const batch = await this.repository.findById(batchId);
    if (!batch) {
      throw new AppError('Production batch not found', 404);
    }
    return new ProductionBatchDTO(batch.production_batch);
  }

  async createBatch(batchData) {
    const batch = await this.repository.create({
      ...batchData,
      status: 'Planned',
      actualProductionQty: 0,
    });
    return new ProductionBatchDTO(batch);
  }

  async updateBatch(batchId, updateData) {
    const existing = await this.repository.findById(batchId);
    if (!existing) {
      throw new AppError('Production batch not found', 404);
    }

    const updated = await this.repository.update(batchId, updateData);
    return new ProductionBatchDTO(updated);
  }

  async completeBatch(batchId, actualProductionQty) {
    const batch = await this.repository.findById(batchId);
    if (!batch) {
      throw new AppError('Production batch not found', 404);
    }

    if (batch.production_batch.status === 'Completed') {
      throw new AppError('Batch is already completed', 400);
    }

    // Update batch status
    const updatedBatch = await this.repository.update(batchId, {
      status: 'Completed',
      actualProductionQty,
      endDate: new Date(),
    });

    // Add to inventory (Logs to inventoryTransactions for Reports)
    await this.inventoryService.addInventory(
      batch.production_batch.productId,
      actualProductionQty,
      'Production Output',
      batchId, // referenceId
      null, // weightKg (optional/calculated elsewhere)
      null, // densityKgPerL
      `Production Batch: ${batchId}`
    );

    // Notify about completion
    try {
      await this.notificationsService.createBatchCompletionNotification(
        batchId,
        batch.product?.productName || 'Product',
        actualProductionQty,
        batch.production_batch.batchCode || batchId
      );
    } catch (err) {
      console.error('Failed to send production completion notification:', err);
    }

    return new ProductionBatchDTO(updatedBatch);
  }

  async deleteBatch(batchId) {
    const existing = await this.repository.findById(batchId);
    if (!existing) {
      throw new AppError('Production batch not found', 404);
    }

    await this.repository.delete(batchId);
  }
}
