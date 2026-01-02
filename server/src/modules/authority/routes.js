import express from 'express';
import authorityController from './controller.js';
import { createCustomLimiter } from '../../middleware/rateLimiter.js';
import { authenticate } from '../../middleware/auth.js';
import { requirePermission } from '../../middleware/requirePermission.js';

const router = express.Router();

// Strict rate limiting for auth endpoints
const authLimiter = createCustomLimiter({
  windowMs: 15 * 60 * 1000,
  max: 50,
  message: 'Too many login attempts, please try again later',
});

const permissionLimiter = createCustomLimiter({
  windowMs: 1 * 60 * 1000,
  max: 100,
  message: 'Too many permission requests, please try again later',
});

// Public auth endpoints
router.post('/login', authLimiter, authorityController.login);
router.post('/logout', authorityController.logout);

// Protected auth endpoints
router.get('/me', authenticate, authorityController.getCurrentUser);

// Permission Management
router.get(
  '/roles',
  authenticate,
  permissionLimiter,
  requirePermission('GET:/auth/roles'),
  authorityController.getRoles
);
router.get(
  '/roles/by-department/:departmentId',
  authenticate,
  permissionLimiter,
  requirePermission('GET:/auth/roles/by-department/:id'),
  authorityController.getRolesByDepartment
);
router.post(
  '/roles',
  authenticate,
  permissionLimiter,
  requirePermission('POST:/auth/roles'),
  authorityController.createRole
);
router.put(
  '/roles/:id',
  authenticate,
  permissionLimiter,
  requirePermission('PUT:/auth/roles/:id'),
  authorityController.updateRole
);
router.delete(
  '/roles/:id',
  authenticate,
  permissionLimiter,
  requirePermission('DELETE:/auth/roles/:id'),
  authorityController.deleteRole
);
router.get(
  '/permissions',
  authenticate,
  permissionLimiter,
  requirePermission('GET:/auth/permissions'),
  authorityController.getPermissions
);
router.get(
  '/matrix',
  authenticate,
  permissionLimiter,
  requirePermission('GET:/auth/matrix'),
  authorityController.getRolePermissions
);
router.post(
  '/permission',
  authenticate,
  permissionLimiter,
  requirePermission('POST:/auth/permission'),
  authorityController.updateRolePermission
);
router.post(
  '/roles/:id/duplicate',
  authenticate,
  permissionLimiter,
  requirePermission('POST:/auth/roles/:id/duplicate'),
  authorityController.duplicateRole
);

export default router;
export { router as authorityRoutes };
