import express from 'express';
import * as accountController from './controller.js';
import { requirePermission } from '../../middleware/requirePermission.js';
import { requireIdempotency } from '../../middleware/idempotency.js';

const router = express.Router();

router.get('/', requirePermission('GET:/accounts'), accountController.getAccounts);
router.get(
  '/summary',
  requirePermission('GET:/accounts/summary'),
  accountController.getPaymentSummary
);
router.get('/:id', requirePermission('GET:/accounts/:id'), accountController.getAccountById);
router.get(
  '/order/:orderId',
  requirePermission('GET:/accounts/order/:id'),
  accountController.getAccountByOrderId
);
router.post(
  '/',
  requirePermission('POST:/accounts'),
  requireIdempotency,
  accountController.createAccount
);
router.put('/:id', requirePermission('PUT:/accounts/:id'), accountController.updateAccount);
router.patch(
  '/:id/payment',
  requirePermission('PATCH:/accounts/:id/payment'),
  accountController.updatePayment
);
router.patch(
  '/:id/delivery',
  requirePermission('PATCH:/accounts/:id/delivery'),
  accountController.updateDelivery
);
router.delete('/:id', requirePermission('DELETE:/accounts/:id'), accountController.deleteAccount);

export default router;
