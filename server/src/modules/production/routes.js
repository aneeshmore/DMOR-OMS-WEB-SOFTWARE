import { Router } from 'express';
import { ProductionController } from './controller.js';
import { requirePermission } from '../../middleware/requirePermission.js';
import { requireIdempotency } from '../../middleware/idempotency.js';

const router = Router();
const controller = new ProductionController();

router.get('/batches', requirePermission('GET:/production-batches'), controller.getAllBatches);
router.get(
  '/batches/:id',
  requirePermission('GET:/production-batches/:id'),
  controller.getBatchById
);
router.post(
  '/batches',
  requirePermission('POST:/production-batches'),
  requireIdempotency,
  controller.createBatch
);
router.put(
  '/batches/:id',
  requirePermission('PUT:/production-batches/:id'),
  controller.updateBatch
);
router.post(
  '/batches/:id/complete',
  requirePermission('POST:/production-batches/:id/complete'),
  controller.completeBatch
);
router.delete(
  '/batches/:id',
  requirePermission('DELETE:/production-batches/:id'),
  controller.deleteBatch
);

export default router;
