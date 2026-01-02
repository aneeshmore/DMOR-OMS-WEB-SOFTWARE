import { Router } from 'express';
import { EmployeesController } from './controller.js';
import { requirePermission } from '../../middleware/requirePermission.js';
import { requireIdempotency } from '../../middleware/idempotency.js';
import { sanitizeBody } from '../../utils/sanitize.js';
import { authenticate } from '../../middleware/auth.js';

const router = Router();
const controller = new EmployeesController();

const employeeSanitizeFields = ['FirstName', 'LastName', 'Email', 'Address', 'Notes', 'Username'];

// Sales persons list - accessible to all authenticated users (for dropdowns)
router.get('/sales-persons', authenticate, controller.getSalesPersons);

// Protected employees routes
router.get('/', requirePermission('GET:/employees'), controller.getAllEmployees);
router.get('/:id', requirePermission('GET:/employees/:id'), controller.getEmployeeById);
router.post(
  '/',
  requirePermission('POST:/employees'),
  requireIdempotency,
  sanitizeBody(employeeSanitizeFields),
  controller.createEmployee
);
router.put(
  '/:id',
  requirePermission('PUT:/employees/:id'),
  sanitizeBody(employeeSanitizeFields),
  controller.updateEmployee
);
router.delete('/:id', requirePermission('DELETE:/employees/:id'), controller.deleteEmployee);

export default router;
