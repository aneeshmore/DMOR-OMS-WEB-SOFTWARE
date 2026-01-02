/**
 * Core Relations
 *
 * Defines relationships for core schema entities.
 */

import { relations } from 'drizzle-orm';
import { units } from './units.js';

// Units Relations
export const unitsRelations = relations(units, ({ many }) => ({}));
