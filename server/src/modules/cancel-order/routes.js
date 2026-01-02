import { Router } from 'express';
import { CancelOrderController } from './controller.js';
import { requirePermission } from '../../middleware/requirePermission.js';

const router = Router();
const controller = new CancelOrderController();

router.get(
  '/cancellable',
  requirePermission('GET:/cancel-order/cancellable'),
  controller.getCancellableOrders
);
router.get(
  '/cancelled',
  requirePermission('GET:/cancel-order/cancelled'),
  controller.getCancelledOrders
);
router.get('/stats', requirePermission('GET:/cancel-order/stats'), controller.getStats);
router.patch(
  '/:orderId/cancel',
  requirePermission('PATCH:/cancel-order/:id/cancel'),
  controller.cancelOrder
);

export default router;
