import { Router } from 'express';
import * as controller from './controller.js';
import { requirePermission } from '../../middleware/requirePermission.js';

const router = Router();

router.get(
  '/final-goods',
  requirePermission('GET:/update-product/final-goods'),
  controller.getFinalGoods
);
router.put(
  '/final-goods/:id',
  requirePermission('PUT:/update-product/final-goods/:id'),
  controller.updateFinalGood
);
router.get(
  '/raw-materials',
  requirePermission('GET:/update-product/raw-materials'),
  controller.getRawMaterials
);
router.put(
  '/raw-materials/:id',
  requirePermission('PUT:/update-product/raw-materials/:id'),
  controller.updateRawMaterial
);
router.get(
  '/packaging-materials',
  requirePermission('GET:/update-product/packaging-materials'),
  controller.getPackagingMaterials
);
router.put(
  '/packaging-materials/:id',
  requirePermission('PUT:/update-product/packaging-materials/:id'),
  controller.updatePackagingMaterial
);

export default router;
