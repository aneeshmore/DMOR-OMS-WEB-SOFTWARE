import express from 'express';
import { ProductionSupervisorController } from './controller.js';
import { requirePermission } from '../../middleware/requirePermission.js';

const router = express.Router();
const controller = new ProductionSupervisorController();

// Get batches (admin/PM or supervisor's own)
router.get(
  '/batches',
  requirePermission('GET:/production-supervisor/batches'),
  controller.getMyBatches
);
router.get(
  '/:supervisorId/batches',
  requirePermission('GET:/production-supervisor/batches'),
  controller.getMyBatches
);

// Get batch details
router.get(
  '/batch/:id',
  requirePermission('GET:/production-supervisor/batch/:id'),
  controller.getBatchDetails
);

// Start batch
router.post(
  '/batch/:id/start',
  requirePermission('POST:/production-supervisor/batch/:id/start'),
  controller.startBatch
);

// Complete batch
router.post(
  '/batch/:id/complete',
  requirePermission('POST:/production-supervisor/batch/:id/complete'),
  controller.completeBatch
);

// Cancel batch
router.put(
  '/batch/:id/cancel',
  requirePermission('PUT:/production-supervisor/batch/:id/cancel'),
  controller.cancelBatch
);

// Export batch chart
router.get(
  '/batch/:id/export',
  requirePermission('GET:/production-supervisor/batch/:id/export'),
  controller.exportBatchChart
);

export default router;
