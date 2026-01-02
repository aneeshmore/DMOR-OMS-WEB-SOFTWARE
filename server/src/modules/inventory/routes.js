import { Router } from 'express';
import { InventoryController } from './controller.js';
import { requirePermission } from '../../middleware/requirePermission.js';

const router = Router();
const controller = new InventoryController();

router.get('/products', requirePermission('GET:/inventory/products'), controller.getAllProducts);
router.get(
  '/products/low-stock',
  requirePermission('GET:/inventory/products/low-stock'),
  controller.getLowStockProducts
);
router.get(
  '/products/:id',
  requirePermission('GET:/inventory/products/:id'),
  controller.getProductById
);
router.get(
  '/products/:id/ledger',
  requirePermission('GET:/inventory/products/:id/ledger'),
  controller.getStockLedger
);
router.post('/products', requirePermission('POST:/inventory/products'), controller.createProduct);
router.put(
  '/products/:id',
  requirePermission('PUT:/inventory/products/:id'),
  controller.updateProduct
);
router.delete(
  '/products/:id',
  requirePermission('DELETE:/inventory/products/:id'),
  controller.deleteProduct
);

export default router;
