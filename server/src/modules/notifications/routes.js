import express from 'express';
import {
  getUserNotifications,
  getAllNotifications,
  markAsRead,
  acknowledgeNotification,
  getUnreadCount,
  getCriticalAlerts,
  deleteNotification,
  createRule,
  deleteRule,
  getAllRules,
  seedRules,
} from './controller.js';
import { authorize } from '../../middleware/auth.js';
import { requirePermission } from '../../middleware/requirePermission.js';

const router = express.Router();

// Note: authenticate middleware is applied globally in routes/index.js

// ============================================
// NOTIFICATION RULES MANAGEMENT (Admin Only)
// ============================================
// These require explicit permissions

router.get('/rules', requirePermission('GET:/notification-rules'), getAllRules);

router.post('/rules', requirePermission('POST:/notification-rules'), createRule);

router.delete('/rules/:ruleId', requirePermission('DELETE:/notification-rules/:id'), deleteRule);

router.post('/rules/seed', requirePermission('POST:/notification-rules'), seedRules);

// ============================================
// ALL NOTIFICATIONS (Admin View - Protected)
// ============================================
router.get('/all', requirePermission('GET:/notifications/all'), getAllNotifications);

// ============================================
// USER NOTIFICATIONS (No Permission Required)
// ============================================
// All authenticated users can access their OWN notifications
// The controller filters by logged-in user's ID

router.get('/', getUserNotifications);
router.get('/unread-count', getUnreadCount);
router.get('/critical-alerts', getCriticalAlerts);
router.patch('/:notificationId/read', markAsRead);
router.patch('/:notificationId/acknowledge', acknowledgeNotification);
router.delete('/:notificationId', deleteNotification);

export default router;
