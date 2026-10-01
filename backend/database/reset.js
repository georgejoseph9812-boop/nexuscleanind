import path from 'path';
import { fileURLToPath } from 'url';
import pg from 'pg';
import dotenv from 'dotenv';
import { execSync } from 'child_process';

dotenv.config();

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const databaseUrl = process.env.DATABASE_URL;

if (!databaseUrl) {
  console.log('ℹ️  DATABASE_URL environment variable is not defined.');
  process.exit(0);
}

if (process.env.NODE_ENV === 'production' && !process.argv.includes('--force')) {
  console.error('⚠️  CRITICAL: Cannot reset database in production without --force flag.');
  process.exit(1);
}

const isCloudHost = process.env.NODE_ENV === 'production' || 
  databaseUrl.includes('supabase.co') || 
  databaseUrl.includes('render.com') ||
  databaseUrl.includes('neon.tech') ||
  databaseUrl.includes('railway.app') ||
  databaseUrl.includes('sslmode=require');

const client = new pg.Client({
  connectionString: databaseUrl,
  ssl: isCloudHost ? { rejectUnauthorized: false } : false
});

async function resetDatabase() {
  try {
    console.log('[RESET] Connecting to PostgreSQL database...');
    await client.connect();
    console.log('✅ Connected. Dropping existing tables...');

    await client.query(`
      DROP TABLE IF EXISTS sorting_items CASCADE;
      DROP TABLE IF EXISTS notifications CASCADE;
      DROP TABLE IF EXISTS awareness_content CASCADE;
      DROP TABLE IF EXISTS eco_activities CASCADE;
      DROP TABLE IF EXISTS eco_scores CASCADE;
      DROP TABLE IF EXISTS resolution_verifications CASCADE;
      DROP TABLE IF EXISTS hotspot_complaints CASCADE;
      DROP TABLE IF EXISTS hotspots CASCADE;
      DROP TABLE IF EXISTS pickup_requests CASCADE;
      DROP TABLE IF EXISTS complaint_status_history CASCADE;
      DROP TABLE IF EXISTS complaint_images CASCADE;
      DROP TABLE IF EXISTS complaints CASCADE;
      DROP TABLE IF EXISTS users CASCADE;
      DROP TABLE IF EXISTS schema_migrations CASCADE;
    `);

    console.log('✅ Tables dropped. Re-applying migrations and seeds...');
    await client.end();

    execSync('node database/migrate.js', { stdio: 'inherit', cwd: path.join(__dirname, '..') });
    execSync('node database/seed.js', { stdio: 'inherit', cwd: path.join(__dirname, '..') });

    console.log('🎉 Database reset completed successfully!');
  } catch (err) {
    console.error('Reset failed:', err.message);
    process.exit(1);
  }
}

resetDatabase();
