/**
 * Role Permissions Schema
 *
 * Maps permissions to roles with granular CRUD controls.
 * Defines what actions each role can perform on specific resources.
 */

import { serial, integer, jsonb } from 'drizzle-orm/pg-core';
import { appSchema } from '../core/app-schema.js';
import { roles } from './roles.js';
import { permissions } from './permissions.js';

export const rolePermissions = appSchema.table('role_permissions', {
  rolePermissionId: serial('role_permission_id').primaryKey(),
  roleId: integer('role_id')
    .notNull()
    .references(() => roles.roleId, { onDelete: 'cascade' }),
  permissionId: integer('permission_id')
    .notNull()
    .references(() => permissions.permissionId, { onDelete: 'cascade' }),
  grantedActions: jsonb('granted_actions').default([]),
});
