import { apiClient } from '@/api/client';

export interface NotificationRule {
  ruleId: number;
  notificationType: string;
  targetType: 'ROLE' | 'DEPARTMENT' | 'USER';
  targetId: number;
  isActive: boolean;
  createdAt: string;
}

export const rulesApi = {
  getAllRules: async (): Promise<NotificationRule[]> => {
    const { data } = await apiClient.get('/notifications/rules');
    return data.data;
  },

  createRule: async (
    rule: Omit<NotificationRule, 'ruleId' | 'createdAt' | 'isActive'>
  ): Promise<NotificationRule> => {
    const { data } = await apiClient.post('/notifications/rules', rule);
    return data.data;
  },

  deleteRule: async (ruleId: number): Promise<void> => {
    await apiClient.delete(`/notifications/rules/${ruleId}`);
  },

  seedRules: async (): Promise<{ seeded: number }> => {
    const { data } = await apiClient.post('/notifications/rules/seed');
    return data.data;
  },
};
