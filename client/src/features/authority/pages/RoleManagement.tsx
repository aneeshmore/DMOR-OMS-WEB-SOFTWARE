import React, { useEffect, useState } from 'react';
import { PageHeader } from '@/components/common';
import { authApi } from '@/features/authority/api/authApi';
import { Role } from '@/types';
import { showToast } from '@/utils/toast';
import {
  Users,
  Shield,
  Edit2,
  Trash2,
  Plus,
  Loader2,
  Home,
  CheckCircle,
  XCircle,
  Save,
  X,
  ChevronRight,
} from 'lucide-react';
import { Link } from 'react-router-dom';
import apiClient from '@/api/client';

// Available landing pages
const LANDING_PAGES = [
  { path: '/dashboard', label: 'Main Dashboard', description: 'Overview with analytics' },
  { path: '/sales/orders', label: 'Sales Orders', description: 'Order management' },
  {
    path: '/operations/production',
    label: 'Production Batches',
    description: 'Production overview',
  },
  {
    path: '/operations/supervisor-batches',
    label: 'Supervisor Batches',
    description: 'Batch execution',
  },
  { path: '/inventory/stock', label: 'Stock Inventory', description: 'Stock management' },
  { path: '/analytics/stock', label: 'Stock Analytics', description: 'Analytics dashboard' },
  { path: '/operations/dispatch', label: 'Dispatch Planning', description: 'Dispatch management' },
  { path: '/crm', label: 'CRM', description: 'Customer visits' },
];

interface RoleFormData {
  roleName: string;
  description: string;
  landingPage: string;
  isActive: boolean;
}

import { useAuth } from '@/contexts/AuthContext';

const RoleManagement: React.FC = () => {
  const { hasPermission } = useAuth();
  const canCreate = hasPermission('permissions', 'create');
  const canModify = hasPermission('permissions', 'modify');
  const canDelete = hasPermission('permissions', 'delete');

  const [loading, setLoading] = useState(true);
  const [roles, setRoles] = useState<Role[]>([]);
  const [editingRole, setEditingRole] = useState<Role | null>(null);
  const [isCreating, setIsCreating] = useState(false);
  const [saving, setSaving] = useState(false);
  const [formData, setFormData] = useState<RoleFormData>({
    roleName: '',
    description: '',
    landingPage: '/dashboard',
    isActive: true,
  });

  const fetchRoles = async () => {
    try {
      setLoading(true);
      const res = await authApi.getRoles();
      if (res.success) {
        setRoles(res.data);
      }
    } catch (error) {
      console.error('Failed to fetch roles:', error);
      showToast.error('Failed to load roles');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchRoles();
  }, []);

  const handleEdit = (role: Role) => {
    setEditingRole(role);
    setFormData({
      roleName: role.roleName,
      description: role.description || '',
      landingPage: (role as any).landingPage || '/dashboard',
      isActive: role.isActive,
    });
    setIsCreating(false);
  };

  const handleCreate = () => {
    setIsCreating(true);
    setEditingRole(null);
    setFormData({
      roleName: '',
      description: '',
      landingPage: '/dashboard',
      isActive: true,
    });
  };

  const handleCancel = () => {
    setEditingRole(null);
    setIsCreating(false);
  };

  const handleSave = async () => {
    if (!formData.roleName.trim()) {
      showToast.error('Role name is required');
      return;
    }

    setSaving(true);
    try {
      if (isCreating) {
        // Create new role
        await apiClient.post('/masters/roles', formData);
        showToast.success('Role created successfully');
      } else if (editingRole) {
        // Update existing role
        await apiClient.put(`/masters/roles/${editingRole.roleId}`, formData);
        showToast.success('Role updated successfully');
      }
      await fetchRoles();
      handleCancel();
    } catch (error: any) {
      console.error('Failed to save role:', error);
      showToast.error(error.response?.data?.message || 'Failed to save role');
    } finally {
      setSaving(false);
    }
  };

  const handleToggleStatus = async (role: Role) => {
    try {
      await apiClient.put(`/masters/roles/${role.roleId}`, {
        ...role,
        isActive: !role.isActive,
      });
      showToast.success(`Role ${role.isActive ? 'deactivated' : 'activated'}`);
      await fetchRoles();
    } catch (error) {
      console.error('Failed to toggle role status:', error);
      showToast.error('Failed to update role status');
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-96">
        <Loader2 className="animate-spin h-8 w-8 text-[var(--primary)]" />
      </div>
    );
  }

  return (
    <div className="space-y-4 sm:space-y-6 animate-fade-in pb-20">
      <PageHeader
        title="Role Management"
        description="Create and configure user roles with landing pages"
      />

      {/* Quick Links */}
      <div className="flex flex-wrap gap-2">
        <Link
          to="/settings/permissions"
          className="flex items-center gap-2 px-3 py-2 bg-[var(--surface)] border border-[var(--border)] rounded-lg text-sm font-medium text-[var(--text-primary)] hover:bg-[var(--background)] transition-colors"
        >
          <Shield size={16} />
          Manage Permissions
        </Link>
      </div>

      {/* Create Button */}
      {canCreate && (
        <div className="flex justify-end">
          <button
            onClick={handleCreate}
            className="flex items-center gap-2 px-4 py-2 bg-[var(--primary)] text-white rounded-lg hover:opacity-90 transition-opacity text-sm font-medium"
          >
            <Plus size={16} />
            New Role
          </button>
        </div>
      )}

      {/* Role Form (Create/Edit) */}
      {(isCreating || editingRole) && (
        <div className="bg-[var(--surface)] border border-[var(--border)] rounded-xl p-4 sm:p-6 shadow-sm animate-fade-in">
          <div className="flex items-center justify-between mb-4">
            <h3 className="font-semibold text-[var(--text-primary)]">
              {isCreating ? 'Create New Role' : `Edit: ${editingRole?.roleName}`}
            </h3>
            <button
              onClick={handleCancel}
              className="p-2 hover:bg-[var(--background)] rounded-lg transition-colors"
            >
              <X size={20} className="text-[var(--text-secondary)]" />
            </button>
          </div>

          <div className="grid gap-4 sm:grid-cols-2">
            {/* Role Name */}
            <div>
              <label className="block text-sm font-medium text-[var(--text-secondary)] mb-1">
                Role Name *
              </label>
              <input
                type="text"
                value={formData.roleName}
                onChange={e => setFormData({ ...formData, roleName: e.target.value })}
                placeholder="e.g., Sales Manager"
                className="w-full px-3 py-2 bg-[var(--background)] border border-[var(--border)] rounded-lg text-[var(--text-primary)] focus:outline-none focus:ring-2 focus:ring-[var(--primary)] text-sm"
              />
            </div>

            {/* Description */}
            <div>
              <label className="block text-sm font-medium text-[var(--text-secondary)] mb-1">
                Description
              </label>
              <input
                type="text"
                value={formData.description}
                onChange={e => setFormData({ ...formData, description: e.target.value })}
                placeholder="Brief description of this role"
                className="w-full px-3 py-2 bg-[var(--background)] border border-[var(--border)] rounded-lg text-[var(--text-primary)] focus:outline-none focus:ring-2 focus:ring-[var(--primary)] text-sm"
              />
            </div>

            {/* Landing Page */}
            <div className="sm:col-span-2">
              <label className="block text-sm font-medium text-[var(--text-secondary)] mb-2">
                <Home size={14} className="inline mr-1" />
                Default Landing Page (Dashboard)
              </label>
              <div className="grid gap-2 sm:grid-cols-2 lg:grid-cols-4">
                {LANDING_PAGES.map(page => (
                  <button
                    key={page.path}
                    type="button"
                    onClick={() => setFormData({ ...formData, landingPage: page.path })}
                    className={`p-3 rounded-lg border-2 text-left transition-all ${
                      formData.landingPage === page.path
                        ? 'border-[var(--primary)] bg-[var(--primary)]/10'
                        : 'border-[var(--border)] hover:border-[var(--text-secondary)]'
                    }`}
                  >
                    <div className="font-medium text-sm text-[var(--text-primary)]">
                      {page.label}
                    </div>
                    <div className="text-xs text-[var(--text-secondary)]">{page.description}</div>
                  </button>
                ))}
              </div>
            </div>

            {/* Active Status */}
            <div className="sm:col-span-2">
              <label className="flex items-center gap-3 cursor-pointer">
                <input
                  type="checkbox"
                  checked={formData.isActive}
                  onChange={e => setFormData({ ...formData, isActive: e.target.checked })}
                  className="w-4 h-4 rounded border-[var(--border)] text-[var(--primary)] focus:ring-[var(--primary)]"
                />
                <span className="text-sm text-[var(--text-primary)]">Role is Active</span>
              </label>
            </div>
          </div>

          {/* Actions */}
          <div className="flex justify-end gap-3 mt-6 pt-4 border-t border-[var(--border)]">
            <button
              onClick={handleCancel}
              className="px-4 py-2 border border-[var(--border)] rounded-lg text-[var(--text-primary)] hover:bg-[var(--background)] transition-colors text-sm"
            >
              Cancel
            </button>
            <button
              onClick={handleSave}
              disabled={saving}
              className="flex items-center gap-2 px-4 py-2 bg-[var(--primary)] text-white rounded-lg hover:opacity-90 disabled:opacity-50 transition-opacity text-sm"
            >
              {saving ? <Loader2 size={14} className="animate-spin" /> : <Save size={14} />}
              {isCreating ? 'Create Role' : 'Save Changes'}
            </button>
          </div>
        </div>
      )}

      {/* Roles List */}
      <div className="bg-[var(--surface)] border border-[var(--border)] rounded-xl overflow-hidden shadow-sm">
        <div className="divide-y divide-[var(--border)]">
          {roles.length === 0 ? (
            <div className="p-8 text-center">
              <Users size={32} className="mx-auto mb-3 text-[var(--text-secondary)]" />
              <p className="text-[var(--text-secondary)]">No roles found</p>
            </div>
          ) : (
            roles.map(role => (
              <div key={role.roleId} className="p-4 hover:bg-[var(--background)] transition-colors">
                <div className="flex items-center gap-4">
                  {/* Role Icon */}
                  <div
                    className={`w-10 h-10 rounded-full flex items-center justify-center shrink-0 ${
                      role.isActive ? 'bg-[var(--primary)]/10' : 'bg-gray-500/10'
                    }`}
                  >
                    <Users
                      size={20}
                      className={role.isActive ? 'text-[var(--primary)]' : 'text-gray-500'}
                    />
                  </div>

                  {/* Role Info */}
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2">
                      <h4 className="font-medium text-[var(--text-primary)]">{role.roleName}</h4>
                      {role.isActive ? (
                        <span className="px-2 py-0.5 text-xs rounded-full bg-green-500/10 text-green-600">
                          Active
                        </span>
                      ) : (
                        <span className="px-2 py-0.5 text-xs rounded-full bg-gray-500/10 text-gray-500">
                          Inactive
                        </span>
                      )}
                    </div>
                    <p className="text-sm text-[var(--text-secondary)] truncate">
                      {role.description || 'No description'}
                    </p>
                    <div className="flex items-center gap-1 mt-1 text-xs text-[var(--text-secondary)]">
                      <Home size={12} />
                      <span>{(role as any).landingPage || '/dashboard'}</span>
                    </div>
                  </div>

                  {/* Actions */}
                  <div className="flex items-center gap-2 shrink-0">
                    <Link
                      to="/settings/permissions"
                      className="p-2 hover:bg-[var(--background)] rounded-lg transition-colors text-[var(--text-secondary)] hover:text-[var(--primary)]"
                      title="Manage Permissions"
                    >
                      <Shield size={16} />
                    </Link>
                    {canModify && (
                      <button
                        onClick={() => handleEdit(role)}
                        className="p-2 hover:bg-[var(--background)] rounded-lg transition-colors text-[var(--text-secondary)] hover:text-[var(--primary)]"
                        title="Edit Role"
                      >
                        <Edit2 size={16} />
                      </button>
                    )}
                    {canModify && (
                      <button
                        onClick={() => handleToggleStatus(role)}
                        className={`p-2 hover:bg-[var(--background)] rounded-lg transition-colors ${
                          role.isActive
                            ? 'text-green-500 hover:text-red-500'
                            : 'text-gray-500 hover:text-green-500'
                        }`}
                        title={role.isActive ? 'Deactivate' : 'Activate'}
                      >
                        {role.isActive ? <CheckCircle size={16} /> : <XCircle size={16} />}
                      </button>
                    )}
                  </div>
                </div>
              </div>
            ))
          )}
        </div>
      </div>
    </div>
  );
};

export default RoleManagement;
