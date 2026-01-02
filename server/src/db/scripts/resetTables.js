import { drizzle } from 'drizzle-orm/node-postgres';
import pg from 'pg';
import { reset } from 'drizzle-seed';
import dotenv from 'dotenv';
import * as schema from '../schema/index.js';
import logger from '../../config/logger.js';

dotenv.config();

/**
 * Reset Database Script using drizzle-seed
 *
 * This script uses drizzle-seed's reset function to efficiently truncate
 * all tables in the database while handling foreign key constraints.
 *
 * For PostgreSQL, it uses: TRUNCATE tableName1, tableName2, ... CASCADE;
 *
 * Usage: node src/db/resetDb.js
 */
async function resetDatabase() {
  const { Pool } = pg;
  let pool;

  try {
    logger.info('🗑️  Starting database reset using drizzle-seed...');

    // Create PostgreSQL pool connection
    pool = new Pool({
      connectionString: process.env.DATABASE_URL,
    });
    const db = drizzle(pool, { schema });

    // Reset all tables defined in schema
    await reset(db, schema);

    logger.info('✅ Database reset complete!');
    logger.info('All tables have been truncated with CASCADE.');
    logger.info('\n📋 Next steps:');
    logger.info('  1. Run: pnpm db:seed  (to populate with fresh data)');

    await pool.end();
    process.exit(0);
  } catch (error) {
    logger.error('❌ Error resetting database:', error);
    if (pool) await pool.end();
    process.exit(1);
  }
}

resetDatabase();
