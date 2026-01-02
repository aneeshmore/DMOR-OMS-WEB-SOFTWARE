/**
 * Auth Relations
 *
 * Defines relationships for authentication and authorization tables.
 */

import { relations } from 'drizzle-orm';
import { roles } from './roles.js';
import { permissions } from './permissions.js';
import { rolePermissions } from './role-permissions.js';
import { employeeRoles } from './employee-roles.js';

// Roles Relations
export const rolesRelations = relations(roles, ({ many }) => ({
  rolePermissions: many(rolePermissions),
  employeeRoles: many(employeeRoles),
}));

// Permissions Relations
export const permissionsRelations = relations(permissions, ({ many }) => ({
  rolePermissions: many(rolePermissions),
}));

// Role Permissions Relations
export const rolePermissionsRelations = relations(rolePermissions, ({ one }) => ({
  role: one(roles, {
    fields: [rolePermissions.roleId],
    references: [roles.roleId],
  }),
  permission: one(permissions, {
    fields: [rolePermissions.permissionId],
    references: [permissions.permissionId],
  }),
}));

// Employee Roles Relations
export const employeeRolesRelations = relations(employeeRoles, ({ one }) => ({
  role: one(roles, {
    fields: [employeeRoles.roleId],
    references: [roles.roleId],
  }),
}));
