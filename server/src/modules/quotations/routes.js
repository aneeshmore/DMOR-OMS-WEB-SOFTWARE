import { Router } from 'express';
import { QuotationsController } from './controller.js';
import { requirePermission } from '../../middleware/requirePermission.js';
import { requireIdempotency } from '../../middleware/idempotency.js';

const router = Router();
const controller = new QuotationsController();

router.get('/', requirePermission('GET:/quotations'), controller.getAllQuotations);
router.post(
  '/',
  requirePermission('POST:/quotations'),
  requireIdempotency,
  controller.createQuotation
);
router.put('/:id', requirePermission('PUT:/quotations/:id'), controller.updateQuotation);
router.patch(
  '/:id/status',
  requirePermission('PATCH:/quotations/:id/status'),
  controller.updateStatus
);
router.post(
  '/:id/approve',
  requirePermission('POST:/quotations/:id/approve'),
  controller.approveQuotation
);
router.post(
  '/:id/reject',
  requirePermission('POST:/quotations/:id/reject'),
  controller.rejectQuotation
);
router.post(
  '/:id/convert',
  requirePermission('POST:/quotations/:id/convert'),
  controller.convertOrder
);

export default router;
