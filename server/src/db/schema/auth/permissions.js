/**
 * Permissions Schema
 *
 * Page-based permissions that can be assigned to roles.
 * Stores page metadata for database-driven permission management.
 */

import { serial, varchar, text, integer, boolean, jsonb } from 'drizzle-orm/pg-core';
import { appSchema } from '../core/app-schema.js';

export const permissions = appSchema.table('permissions', {
  permissionId: serial('permission_id').primaryKey(),
  permissionName: varchar('permission_name', { length: 150 }).notNull().unique(),
  description: text('description'),
  // Page metadata for DB-driven permission management
  pagePath: varchar('page_path', { length: 255 }),
  pageLabel: varchar('page_label', { length: 100 }),
  pageGroup: varchar('page_group', { length: 50 }),
  parentId: integer('parent_id').references(() => permissions.permissionId),
  isPage: boolean('is_page').default(true),
  // Available actions for this permission (e.g., ['view', 'export'] for reports)
  availableActions: jsonb('available_actions').default(['view', 'create', 'modify', 'delete']),
});
