import express from 'express';
import { suppliersController } from './controller.js';
import { requirePermission } from '../../middleware/requirePermission.js';
import { requireIdempotency } from '../../middleware/idempotency.js';

const router = express.Router();

router.get('/', requirePermission('GET:/suppliers'), suppliersController.getAllSuppliers);
router.get('/:id', requirePermission('GET:/suppliers/:id'), suppliersController.getSupplierById);
router.post(
  '/',
  requirePermission('POST:/suppliers'),
  requireIdempotency,
  suppliersController.createSupplier
);
router.put('/:id', requirePermission('PUT:/suppliers/:id'), suppliersController.updateSupplier);
router.delete(
  '/:id',
  requirePermission('DELETE:/suppliers/:id'),
  suppliersController.deleteSupplier
);

export default router;
