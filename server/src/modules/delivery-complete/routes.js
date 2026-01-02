import { Router } from 'express';
import { DeliveryCompleteController } from './controller.js';
import { requirePermission } from '../../middleware/requirePermission.js';

const router = Router();
const controller = new DeliveryCompleteController();

router.get('/', requirePermission('GET:/delivery-complete'), controller.getDeliveries);
router.patch(
  '/:orderId/deliver',
  requirePermission('PATCH:/delivery-complete/:id/deliver'),
  controller.markDelivered
);
router.patch(
  '/:orderId/return',
  requirePermission('PATCH:/delivery-complete/:id/return'),
  controller.returnOrder
);
router.patch(
  '/:orderId/cancel',
  requirePermission('PATCH:/delivery-complete/:id/cancel'),
  controller.cancelOrder
);

export default router;
