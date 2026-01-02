import { Router } from 'express';
import { OrdersController } from './controller.js';
import { requirePermission } from '../../middleware/requirePermission.js';
import { requireIdempotency } from '../../middleware/idempotency.js';
import { sanitizeBody } from '../../utils/sanitize.js';

const router = Router();
const controller = new OrdersController();

// Fields to sanitize for order data
const orderSanitizeFields = [
  'Notes',
  'Remarks',
  'ShippingAddress',
  'BillingAddress',
  'CustomerNotes',
];

router.get('/', requirePermission('GET:/orders'), controller.getAllOrders);
router.get('/stats', requirePermission('GET:/orders/stats'), controller.getOrderStats);
router.get('/:id', requirePermission('GET:/orders/:id'), controller.getOrderById);
router.post(
  '/',
  requirePermission('POST:/orders'),
  requireIdempotency,
  sanitizeBody(orderSanitizeFields),
  controller.createOrder
);
router.put(
  '/:id',
  requirePermission('PUT:/orders/:id'),
  sanitizeBody(orderSanitizeFields),
  controller.updateOrder
);
router.delete('/:id', requirePermission('DELETE:/orders/:id'), controller.deleteOrder);

export default router;
