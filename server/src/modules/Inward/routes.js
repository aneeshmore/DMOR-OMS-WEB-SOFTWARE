import { Router } from 'express';
import { InwardController } from './controller.js';
import { requirePermission } from '../../middleware/requirePermission.js';
import { requireIdempotency } from '../../middleware/idempotency.js';

const router = Router();
const controller = new InwardController();

router.get('/', requirePermission('GET:/inward'), controller.getAllInwards);
router.get('/bill/:billNo', requirePermission('GET:/inward/bill/:id'), controller.getBillInfo);
router.delete('/bill', requirePermission('DELETE:/inward/bill'), controller.deleteBill);
router.get('/:id', requirePermission('GET:/inward/:id'), controller.getInwardById);
router.post('/', requirePermission('POST:/inward'), requireIdempotency, controller.createInward);
router.put('/:id', requirePermission('PUT:/inward/:id'), controller.updateInward);
router.delete('/:id', requirePermission('DELETE:/inward/:id'), controller.deleteInward);

export default router;
