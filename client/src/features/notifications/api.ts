import { apiClient } from '@/api/client';
import type { Notification, NotificationFilters, UnreadCountResponse } from './types';

export const notificationsApi = {
  // Get user's notifications
  getNotifications: (filters?: NotificationFilters) =>
    apiClient.get<{ data: Notification[] }>('/notifications', { params: filters }),

  // Get ALL System Notifications (Admin only)
  getAllNotifications: () => apiClient.get<{ data: Notification[] }>('/notifications/all'),

  // Mark notification as read
  markAsRead: (notificationId: number) => apiClient.patch(`/notifications/${notificationId}/read`),

  // Acknowledge notification
  acknowledge: (notificationId: number) =>
    apiClient.patch(`/notifications/${notificationId}/acknowledge`),

  // Get unread count
  getUnreadCount: () => apiClient.get<{ data: UnreadCountResponse }>('/notifications/unread-count'),

  // Get critical alerts
  getCriticalAlerts: () =>
    apiClient.get<{ data: Notification[] }>('/notifications/critical-alerts'),

  // Delete notification
  deleteNotification: (notificationId: number) =>
    apiClient.delete(`/notifications/${notificationId}`),
};
