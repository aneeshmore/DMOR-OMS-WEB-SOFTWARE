/**
 * Core App Schema Configuration
 *
 * Defines the PostgreSQL schema for the application.
 * This is the base schema that all tables belong to.
 */

import { pgSchema } from 'drizzle-orm/pg-core';

export const appSchema = pgSchema('app');
