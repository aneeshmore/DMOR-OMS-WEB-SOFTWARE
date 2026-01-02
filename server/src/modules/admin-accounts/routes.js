import { Router } from 'express';
import { AdminAccountsController } from './controller.js';
import { requirePermission } from '../../middleware/requirePermission.js';

const router = Router();
const controller = new AdminAccountsController();

router.get(
  '/pending-payments',
  requirePermission('GET:/admin-accounts/pending-payments'),
  controller.getPendingPayments
);
router.get(
  '/cancelled-orders',
  requirePermission('GET:/admin-accounts/cancelled-orders'),
  controller.getCancelledOrders
);
router.get('/:id', requirePermission('GET:/admin-accounts/:id'), controller.getOrderDetails);
router.post(
  '/:id/accept',
  requirePermission('POST:/admin-accounts/:id/accept'),
  controller.acceptOrder
);
router.put('/:id/hold', requirePermission('PUT:/admin-accounts/:id/hold'), controller.holdOrder);
router.put(
  '/:id/reject',
  requirePermission('PUT:/admin-accounts/:id/reject'),
  controller.rejectOrder
);
router.put(
  '/:id/bill-no',
  requirePermission('PUT:/admin-accounts/:id/bill-no'),
  controller.updateBillNo
);
router.put(
  '/:id/resume',
  requirePermission('PUT:/admin-accounts/:id/resume'),
  controller.resumeOrder
);
router.put(
  '/:id/clear-payment',
  requirePermission('PUT:/admin-accounts/:id/clear-payment'),
  controller.clearPayment
);

export default router;
