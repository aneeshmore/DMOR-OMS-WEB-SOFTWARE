/**
 * Notification Rules Schema
 *
 * Defines dynamic rules for message delivery based on event type.
 */

import {
  pgTable,
  serial,
  varchar,
  integer,
  boolean,
  timestamp,
  uniqueIndex,
} from 'drizzle-orm/pg-core';
import { appSchema } from '../core/app-schema.js';
import { employees } from '../organization/employees.js'; // If we target specific users
import { roles } from '../auth/roles.js'; // Assuming roles table exists, need to verify path
import { departments } from '../organization/departments.js'; // Assuming departments table exists

export const notificationRules = appSchema.table(
  'notification_rules',
  {
    ruleId: serial('rule_id').primaryKey(),
    notificationType: varchar('notification_type', { length: 100 }).notNull(), // e.g., 'MaterialShortage', 'NewOrder'
    targetType: varchar('target_type', { length: 20 }).notNull(), // 'ROLE', 'DEPARTMENT', 'USER'

    // Target IDs (One of these should be populated based on targetType)
    // We store IDs as integers. For ROLE, it's roleId. For DEPT, departmentId. For USER, employeeId.
    targetId: integer('target_id').notNull(),

    // Optional: For UI display purposes or validation, we might want to store readable names,
    // but relying on ID is safer for relations.

    isActive: boolean('is_active').default(true),

    createdAt: timestamp('created_at').defaultNow().notNull(),
    updatedAt: timestamp('updated_at').defaultNow().notNull(),
  },
  table => {
    return {
      // Ensure we don't have duplicate rules for the same type+target
      uniqueRule: uniqueIndex('notification_rules_unique_target_idx').on(
        table.notificationType,
        table.targetType,
        table.targetId
      ),
    };
  }
);
