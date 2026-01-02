import { defineConfig } from 'drizzle-kit';
import dotenv from 'dotenv';

dotenv.config();

// Remove channel_binding parameter for pg driver compatibility
const connectionString = process.env.DATABASE_URL?.replace('&channel_binding=require', '');

export default defineConfig({
  schema: './src/db/schema/index.js',
  out: './database_schemas/migrations',
  dialect: 'postgresql',
  dbCredentials: {
    url: connectionString,
  },
  schemaFilter: ['app'],
  verbose: true,
  strict: true,
});
