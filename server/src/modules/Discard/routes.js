import { Router } from 'express';
import { DiscardController } from './controller.js';
import { requirePermission } from '../../middleware/requirePermission.js';
import { requireIdempotency } from '../../middleware/idempotency.js';

const router = Router();
const controller = new DiscardController();

router.get('/', requirePermission('GET:/discard'), controller.getAllDiscards);
router.get('/:id', requirePermission('GET:/discard/:id'), controller.getDiscardById);
router.post('/', requirePermission('POST:/discard'), requireIdempotency, controller.createDiscard);
router.put('/:id', requirePermission('PUT:/discard/:id'), controller.updateDiscard);
router.delete('/:id', requirePermission('DELETE:/discard/:id'), controller.deleteDiscard);

export default router;
