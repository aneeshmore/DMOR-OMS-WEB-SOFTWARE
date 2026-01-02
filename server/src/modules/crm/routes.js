import { Router } from 'express';
import { CrmController } from './controller.js';
import { requirePermission } from '../../middleware/requirePermission.js';
import { requireIdempotency } from '../../middleware/idempotency.js';

const router = Router();
const controller = new CrmController();

router.get('/visits', requirePermission('GET:/crm/visits'), controller.getVisits);
router.post(
  '/visits',
  requirePermission('POST:/crm/visits'),
  requireIdempotency,
  controller.createVisit
);
router.patch('/visits/:id', requirePermission('PATCH:/crm/visits/:id'), controller.updateVisit);

export const crmRoutes = router;
