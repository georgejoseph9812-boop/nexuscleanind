import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import pg from 'pg';
import dotenv from 'dotenv';

dotenv.config();

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const databaseUrl = process.env.DATABASE_URL;

if (!databaseUrl) {
  console.log('------------------------------------------------------------');
  console.log('ℹ️  DATABASE_URL environment variable is not defined.');
  console.log('To run migrations against a live database, define DATABASE_URL in backend/.env:');
  console.log('Example: DATABASE_URL=postgresql://user:password@localhost:5432/nexus_clean');
  console.log('         DATABASE_URL=postgresql://postgres.xyz:password@aws-0-region.pooler.supabase.com:6543/postgres');
  console.log('------------------------------------------------------------');
  process.exit(0);
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

async function runMigrations() {
  try {
    console.log('[MIGRATION] Connecting to PostgreSQL database...');
    await client.connect();
    console.log('✅ Connected successfully.');

    // 1. Ensure migrations tracking table exists
    await client.query(`
      CREATE TABLE IF NOT EXISTS schema_migrations (
        id SERIAL PRIMARY KEY,
        name VARCHAR(255) UNIQUE NOT NULL,
        applied_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
      );
    `);

    // 2. Fetch applied migrations
    const res = await client.query('SELECT name FROM schema_migrations ORDER BY id ASC');
    const appliedMigrations = new Set(res.rows.map((r) => r.name));

    // 3. Scan migrations directory
    const migrationsDir = path.join(__dirname, 'migrations');
    if (!fs.existsSync(migrationsDir)) {
      console.log('No migrations directory found.');
      return;
    }

    const files = fs.readdirSync(migrationsDir)
      .filter((f) => f.endsWith('.sql'))
      .sort();

    let appliedCount = 0;

    for (const file of files) {
      if (!appliedMigrations.has(file)) {
        console.log(`[MIGRATION] Applying: ${file}...`);
        const sql = fs.readFileSync(path.join(migrationsDir, file), 'utf-8');

        await client.query('BEGIN');
        try {
          await client.query(sql);
          await client.query('INSERT INTO schema_migrations (name) VALUES ($1)', [file]);
          await client.query('COMMIT');
          console.log(`✅ Applied: ${file}`);
          appliedCount++;
        } catch (err) {
          await client.query('ROLLBACK');
          console.error(`❌ Failed applying migration ${file}:`, err.message);
          throw err;
        }
      } else {
        console.log(`⏭️  Already applied: ${file}`);
      }
    }

    console.log('------------------------------------------------------------');
    console.log(`🎉 Migration completed. ${appliedCount} new migrations applied.`);
    console.log('------------------------------------------------------------');
  } catch (error) {
    console.error('Migration failed:', error);
    process.exit(1);
  } finally {
    await client.end();
  }
}

runMigrations();
