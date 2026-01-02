import { ProductionService } from './service.js';
import { createProductionBatchSchema, updateProductionBatchSchema } from './schema.js';
import logger from '../../config/logger.js';

export class ProductionController {
  constructor() {
    this.service = new ProductionService();
  }

  getAllBatches = async (req, res, next) => {
    try {
      const filters = {
        status: req.query.status,
      };

      const batches = await this.service.getAllBatches(filters);

      res.json({
        success: true,
        data: batches,
      });
    } catch (error) {
      next(error);
    }
  };

  getBatchById = async (req, res, next) => {
    try {
      const batchId = req.params.id;
      const batch = await this.service.getBatchById(batchId);

      res.json({
        success: true,
        data: batch,
      });
    } catch (error) {
      next(error);
    }
  };

  createBatch = async (req, res, next) => {
    try {
      const validatedData = createProductionBatchSchema.parse(req.body);
      const batch = await this.service.createBatch(validatedData);

      logger.info('Production batch created', { batchId: batch.batchId });

      res.status(201).json({
        success: true,
        data: batch,
      });
    } catch (error) {
      next(error);
    }
  };

  updateBatch = async (req, res, next) => {
    try {
      const batchId = req.params.id;
      const validatedData = updateProductionBatchSchema.parse(req.body);

      const batch = await this.service.updateBatch(batchId, validatedData);

      logger.info('Production batch updated', { batchId });

      res.json({
        success: true,
        data: batch,
      });
    } catch (error) {
      next(error);
    }
  };

  completeBatch = async (req, res, next) => {
    try {
      const batchId = req.params.id;
      const { actualProductionQty } = req.body;

      if (!actualProductionQty) {
        return res.status(400).json({
          success: false,
          message: 'actualProductionQty is required',
        });
      }

      const batch = await this.service.completeBatch(batchId, actualProductionQty);

      logger.info('Production batch completed', { batchId });

      res.json({
        success: true,
        data: batch,
        message: 'Batch completed and stock updated successfully',
      });
    } catch (error) {
      next(error);
    }
  };

  deleteBatch = async (req, res, next) => {
    try {
      const batchId = req.params.id;
      await this.service.deleteBatch(batchId);

      logger.info('Production batch deleted', { batchId });

      res.json({
        success: true,
        message: 'Production batch deleted successfully',
      });
    } catch (error) {
      next(error);
    }
  };
}
