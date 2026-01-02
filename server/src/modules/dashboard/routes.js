import { Router } from 'express';
import { dashboardController } from './controller.js';
import { requirePermission } from '../../middleware/requirePermission.js';

const router = Router();

router.get(
  '/product-stock-view',
  requirePermission('GET:/dashboard/product-stock-view'),
  dashboardController.getProductStockView
);
router.get(
  '/order-payment-status',
  requirePermission('GET:/dashboard/order-payment-status'),
  dashboardController.getOrderPaymentStatus
);
router.get(
  '/production-status',
  requirePermission('GET:/dashboard/production-status'),
  dashboardController.getProductionStatusReport
);

export default router;
export { router as dashboardRoutes };
