import { Router } from 'express';
import { PMOrdersController } from './controller.js';
import { requirePermission } from '../../middleware/requirePermission.js';

const router = Router();
const controller = new PMOrdersController();

router.get(
  '/approval-queue',
  requirePermission('GET:/pm-orders/approval-queue'),
  controller.getOrdersForApproval
);
router.put(
  '/:id/approve',
  requirePermission('PUT:/pm-orders/:id/approve'),
  controller.approveOrder
);

export default router;
