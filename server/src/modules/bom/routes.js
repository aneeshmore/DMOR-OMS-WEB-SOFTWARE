import { Router } from 'express';
import { BOMController } from './controller.js';
import { requirePermission } from '../../middleware/requirePermission.js';

const router = Router();
const controller = new BOMController();

router.get(
  '/finished-goods',
  requirePermission('GET:/bom/finished-goods'),
  controller.getFinishedGoods
);
router.post('/calculate', requirePermission('POST:/bom/calculate'), controller.calculateBOM);
router.get(
  '/finished-good/:finishedGoodId',
  requirePermission('GET:/bom/finished-good/:id'),
  controller.getBOMByFinishedGood
);
router.post('/', requirePermission('POST:/bom'), controller.createBOM);
router.put('/:id', requirePermission('PUT:/bom/:id'), controller.updateBOM);
router.delete('/:id', requirePermission('DELETE:/bom/:id'), controller.deleteBOM);
router.post(
  '/finished-good/:finishedGoodId/replace',
  requirePermission('POST:/bom/finished-good/:id/replace'),
  controller.replaceBOM
);

export default router;
