import { ProductionSupervisorService } from './service.js';
import { startBatchSchema, completeBatchSchema } from './schema.js';
import logger from '../../config/logger.js';

export class ProductionSupervisorController {
  constructor() {
    this.service = new ProductionSupervisorService();
  }

  // Get batches assigned to current supervisor (or all batches for admin/PM)
  getMyBatches = async (req, res, next) => {
    try {
      // Get supervisorId from params (legacy route) or query parameter
      const supervisorId = req.params.supervisorId
        ? parseInt(req.params.supervisorId)
        : req.query.supervisorId
          ? parseInt(req.query.supervisorId)
          : undefined;

      const { status } = req.query;

      const batches = await this.service.getMySupervisorBatches(supervisorId, status);

      res.json({
        success: true,
        data: batches,
      });
    } catch (error) {
      next(error);
    }
  };

  // Get batch details with all related information
  getBatchDetails = async (req, res, next) => {
    try {
      const batchId = parseInt(req.params.id);
      const batch = await this.service.getBatchFullDetails(batchId);

      res.json({
        success: true,
        data: batch,
      });
    } catch (error) {
      next(error);
    }
  };

  // Start production batch
  startBatch = async (req, res, next) => {
    try {
      const batchId = parseInt(req.params.id);
      const validatedData = startBatchSchema.parse(req.body);

      const batch = await this.service.startBatch(batchId, validatedData);

      logger.info('Production batch started', {
        batchId,
        supervisorId: validatedData.supervisorId,
      });

      res.json({
        success: true,
        data: batch,
        message: 'Batch started successfully',
      });
    } catch (error) {
      next(error);
    }
  };

  // Complete production batch
  completeBatch = async (req, res, next) => {
    try {
      const batchId = parseInt(req.params.id);
      // Fill completedBy from authenticated user (if available) and
      // map client `notes` to `productionRemarks` for compatibility.
      const completedBy = req.user?.employeeId || 1;
      const body = {
        ...req.body,
        completedBy,
        productionRemarks: req.body.productionRemarks || req.body.notes,
      };

      const validatedData = completeBatchSchema.parse(body);

      const batch = await this.service.completeBatch(batchId, validatedData);

      logger.info('Production batch completed', { batchId, completedBy });

      res.json({
        success: true,
        data: batch,
        message: 'Batch completed successfully',
      });
    } catch (error) {
      next(error);
    }
  };

  // Cancel production batch
  cancelBatch = async (req, res, next) => {
    try {
      const batchId = parseInt(req.params.id);
      const { reason, cancelledBy } = req.body;

      const batch = await this.service.cancelBatch(batchId, reason, parseInt(cancelledBy));

      logger.info('Production batch cancelled', { batchId, reason });

      res.json({
        success: true,
        data: batch,
        message: 'Batch cancelled successfully',
      });
    } catch (error) {
      next(error);
    }
  };

  // Export batch chart (PDF/Excel)
  exportBatchChart = async (req, res, next) => {
    try {
      const batchId = parseInt(req.params.id);
      const format = req.query.format || 'pdf';

      const chartData = await this.service.generateBatchChart(batchId);

      res.json({
        success: true,
        data: chartData,
        message: 'Batch chart generated successfully',
      });
    } catch (error) {
      next(error);
    }
  };
}
