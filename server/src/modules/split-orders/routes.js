import { Router } from 'express';
import * as splitOrdersController from './controller.js';
import { requirePermission } from '../../middleware/requirePermission.js';

const router = Router();

router.get(
  '/search',
  requirePermission('GET:/split-orders/search'),
  splitOrdersController.searchOrder
);
router.post(
  '/:originalOrderId/split',
  requirePermission('POST:/split-orders/:id/split'),
  splitOrdersController.splitOrder
);

export default router;
