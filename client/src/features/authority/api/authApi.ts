/**
 * Auth API
 * Authentication endpoints
 */

import apiClient from '@/api/client';
import { LoginCredentials, AuthResponse } from '@/types';

export interface Role {
  roleId: number;
  roleName: string;
  description?: string;
  departmentId?: number;
  landingPage?: string;
  isSystemRole?: boolean;
  isActive?: boolean;
  createdAt?: string;
}

export interface Permission {
  permissionId: number;
  permissionName: string;
  description?: string;
  isPage?: boolean;
  pagePath?: string;
  pageLabel?: string;
  availableActions?: string[];
}

export const authApi = {
  async login(credentials: LoginCredentials): Promise<AuthResponse> {
    try {
      const { data } = await apiClient.post<AuthResponse>('/auth/login', credentials, {
        skipErrorToast: true,
      });
      return data;
    } catch (error: any) {
      return {
        success: false,
        message: error.response?.data?.message || error.message || 'Login failed',
      };
    }
  },

  async logout(): Promise<void> {
    await apiClient.post('/auth/logout');
  },

  async getCurrentUser(): Promise<any> {
    const { data } = await apiClient.get('/auth/me');
    return data;
  },

  async getRoles(): Promise<any> {
    const { data } = await apiClient.get('/auth/roles');
    return data;
  },

  async getRolesByDepartment(departmentId: number): Promise<any> {
    const { data } = await apiClient.get(`/auth/roles/by-department/${departmentId}`);
    return data;
  },

  async createRole(roleData: Partial<Role>): Promise<any> {
    const { data } = await apiClient.post('/auth/roles', roleData);
    return data;
  },

  async updateRole(roleId: number, roleData: Partial<Role>): Promise<any> {
    const { data } = await apiClient.put(`/auth/roles/${roleId}`, roleData);
    return data;
  },

  async deleteRole(roleId: number): Promise<any> {
    const { data } = await apiClient.delete(`/auth/roles/${roleId}`);
    return data;
  },

  async getPermissions(): Promise<any> {
    const { data } = await apiClient.get('/auth/permissions');
    return data;
  },

  async getRolePermissions(): Promise<any> {
    const { data } = await apiClient.get('/auth/matrix');
    return data;
  },

  async updateRolePermission(
    roleId: number,
    permissionId: number,
    grantedActions: string[]
  ): Promise<any> {
    const { data } = await apiClient.post('/auth/permission', {
      roleId,
      permissionId,
      grantedActions,
    });
    return data;
  },

  async duplicateRole(
    sourceRoleId: number,
    newRoleName: string,
    description?: string
  ): Promise<any> {
    const { data } = await apiClient.post(`/auth/roles/${sourceRoleId}/duplicate`, {
      newRoleName,
      description,
    });
    return data;
  },
};
