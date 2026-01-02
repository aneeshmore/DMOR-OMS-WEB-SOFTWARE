import pg from 'pg';
import dotenv from 'dotenv';
import logger from '../../config/logger.js';

dotenv.config();

const { Pool } = pg;
const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
});

/**
 * Drop and recreate the app schema
 * Use this when you need to completely reset the database structure
 */
async function dropSchema() {
  try {
    logger.info('🗑️  Dropping app schema...');
    await pool.query('DROP SCHEMA IF EXISTS app CASCADE');

    logger.info('✨ Creating fresh app schema...');
    await pool.query('CREATE SCHEMA app');

    logger.info('✅ Schema drop and recreation complete!');
    logger.info('\n📋 Next steps:');
    logger.info('  1. Run: pnpm db:push  (to create tables)');
    logger.info('  2. Run: pnpm db:seed  (to populate with data)');
    logger.info('  Or simply run: pnpm db:init (does all steps)');

    await pool.end();
    process.exit(0);
  } catch (error) {
    logger.error('❌ Error dropping schema:', error.message);
    await pool.end();
    process.exit(1);
  }
}

dropSchema();
