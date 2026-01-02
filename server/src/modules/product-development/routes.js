import { Router } from 'express';
import { ProductDevelopmentController } from './controller.js';
import { requirePermission } from '../../middleware/requirePermission.js';

const router = Router();
const controller = new ProductDevelopmentController();

router.post('/', requirePermission('POST:/product-development'), controller.create);
router.get(
  '/master/:masterProductId',
  requirePermission('GET:/product-development/master/:id'),
  controller.getByMasterProductId
);
router.get(
  '/ratios/:baseMpId/:hardenerMpId',
  requirePermission('GET:/product-development/ratios/:id/:id'),
  controller.getMixingRatios
);

export default router;
