import { Router } from 'express';
import { masterProductsController } from './controller.js';
import { requirePermission } from '../../middleware/requirePermission.js';
import { requireIdempotency } from '../../middleware/idempotency.js';

const router = Router();

// Master Product routes
router.get(
  '/master-products',
  requirePermission('GET:/catalog/master-products'),
  masterProductsController.getAllMasterProducts
);
router.get(
  '/master-products/:id',
  requirePermission('GET:/catalog/master-products/:id'),
  masterProductsController.getMasterProductById
);
router.post(
  '/master-products',
  requirePermission('POST:/catalog/master-products'),
  requireIdempotency,
  masterProductsController.createMasterProduct
);
router.put(
  '/master-products/:id',
  requirePermission('PUT:/catalog/master-products/:id'),
  masterProductsController.updateMasterProduct
);
router.delete(
  '/master-products/:id',
  requirePermission('DELETE:/catalog/master-products/:id'),
  masterProductsController.deleteMasterProduct
);

// Product routes
router.get(
  '/products',
  requirePermission('GET:/catalog/products'),
  masterProductsController.getAllProducts
);
router.get(
  '/products/low-stock',
  requirePermission('GET:/catalog/products/low-stock'),
  masterProductsController.getLowStockProducts
);
router.get(
  '/products/type/:type',
  requirePermission('GET:/catalog/products/type/:type'),
  masterProductsController.getProductsByType
);
router.get(
  '/products/:id',
  requirePermission('GET:/catalog/products/:id'),
  masterProductsController.getProductById
);
router.post(
  '/products',
  requirePermission('POST:/catalog/products'),
  requireIdempotency,
  masterProductsController.createProduct
);
router.put(
  '/products/:id',
  requirePermission('PUT:/catalog/products/:id'),
  masterProductsController.updateProduct
);
router.delete(
  '/products/:id',
  requirePermission('DELETE:/catalog/products/:id'),
  masterProductsController.deleteProduct
);

// Calculation routes
router.post(
  '/products/:id/calculate-rm-cost',
  requirePermission('POST:/catalog/products/:id/calculate-rm-cost'),
  masterProductsController.calculateRMCost
);
router.post(
  '/products/recalculate-all-costs',
  requirePermission('POST:/catalog/products/recalculate-all-costs'),
  masterProductsController.recalculateAllCosts
);

export default router;
export { router as masterProductsRoutes };
