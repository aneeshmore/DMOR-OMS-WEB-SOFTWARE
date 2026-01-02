import { Router } from 'express';
import { DispatchPlanningController } from './controller.js';
import { requirePermission } from '../../middleware/requirePermission.js';
import { requireIdempotency } from '../../middleware/idempotency.js';

const router = Router();
const controller = new DispatchPlanningController();

router.get(
  '/queue',
  requirePermission('GET:/dispatch-planning/queue'),
  controller.getDispatchQueue
);
router.get(
  '/returned-queue',
  requirePermission('GET:/dispatch-planning/returned-queue'),
  controller.getReturnedQueue
);
router.post(
  '/create',
  requirePermission('POST:/dispatch-planning/create'),
  requireIdempotency,
  controller.createDispatch
);
router.patch(
  '/:orderId/requeue',
  requirePermission('PATCH:/dispatch-planning/:id/requeue'),
  controller.requeueOrder
);
router.get(
  '/:id/details',
  requirePermission('GET:/dispatch-planning/:id/details'),
  controller.getDispatchDetails
);

export default router;
