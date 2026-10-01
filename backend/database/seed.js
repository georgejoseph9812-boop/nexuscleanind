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
  console.log('To run seeds against a live database, define DATABASE_URL in backend/.env:');
  console.log('Example: DATABASE_URL=postgresql://user:password@localhost:5432/nexus_clean');
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

async function runSeed() {
  try {
    console.log('[SEED] Connecting to PostgreSQL database...');
    await client.connect();
    console.log('✅ Connected successfully.');

    const seedSqlPath = path.join(__dirname, 'seed.sql');
    if (!fs.existsSync(seedSqlPath)) {
      console.error('❌ seed.sql file not found.');
      return;
    }

    console.log('[SEED] Executing seed.sql statements...');
    const seedSql = fs.readFileSync(seedSqlPath, 'utf-8');

    await client.query('BEGIN');
    await client.query(seedSql);

    // Insert sorting items if table exists
    const checkTable = await client.query(`
      SELECT EXISTS (
        SELECT FROM information_schema.tables 
        WHERE table_name = 'sorting_items'
      );
    `);

    if (checkTable.rows[0].exists) {
      const items = [
        ['item-1', 'Plastic Water Bottle', 'Recyclable', 'Milk', 'https://images.unsplash.com/photo-1523381294911-8d3cead13475?auto=format&fit=crop&w=400&q=80', 'Plastic PET bottles can take up to 450 years to decompose. Empty and crush before recycling!', JSON.stringify(['Recyclable', 'Dry'])],
        ['item-2', 'Banana Peel', 'Wet', 'Apple', 'https://images.unsplash.com/photo-1528825871115-3581a5387919?auto=format&fit=crop&w=400&q=80', 'Banana peels decompose in 2-5 weeks and enrich garden soil with potassium and nitrogen when composted.', JSON.stringify(['Wet'])],
        ['item-3', 'Lithium AA Battery', 'Hazardous', 'BatteryCharging', 'https://images.unsplash.com/photo-1619725002198-6a689b72f41d?auto=format&fit=crop&w=400&q=80', 'Batteries contain cadmium, lead, and acid that contaminate groundwater if dumped in ordinary landfills.', JSON.stringify(['Hazardous', 'E-Waste'])],
        ['item-4', 'Old Newspaper & Paper Bags', 'Recyclable', 'Newspaper', 'https://images.unsplash.com/photo-1586075010923-2dd4570fb338?auto=format&fit=crop&w=400&q=80', 'Recycling 1 ton of newspaper saves 17 mature trees and 7,000 gallons of water.', JSON.stringify(['Recyclable', 'Dry'])],
        ['item-5', 'Empty Glass Beverage Bottle', 'Recyclable', 'Wine', 'https://images.unsplash.com/photo-1513558161293-cdaf765ed2fd?auto=format&fit=crop&w=400&q=80', 'Glass is 100% recyclable indefinitely without any loss in purity or structural quality.', JSON.stringify(['Recyclable', 'Dry'])],
        ['item-6', 'Leftover Cooked Food Waste', 'Wet', 'Utensils', 'https://images.unsplash.com/photo-1546069901-ba9599a7e63c?auto=format&fit=crop&w=400&q=80', 'Municipal bio-methanation plants convert segregated kitchen food waste into clean CNG fuel and compost.', JSON.stringify(['Wet'])],
        ['item-7', 'Aerosol Deodorant Spray Can', 'Hazardous', 'AlertTriangle', 'https://images.unsplash.com/photo-1522337360788-8b13dee7a37e?auto=format&fit=crop&w=400&q=80', 'Pressurized propellant containers can explode under compactor pressure; dispose through chemical collection channels.', JSON.stringify(['Hazardous'])],
        ['item-8', 'Corrugated Cardboard Box', 'Dry', 'Package', 'https://images.unsplash.com/photo-1607344645866-009c320c5ab8?auto=format&fit=crop&w=400&q=80', 'Flattening cardboard boxes reduces collection vehicle volume by 70%, preventing unnecessary diesel emissions.', JSON.stringify(['Dry', 'Recyclable'])]
      ];

      for (const item of items) {
        await client.query(`
          INSERT INTO sorting_items (id, name, category, icon, image, fact, accepted_in)
          VALUES ($1, $2, $3, $4, $5, $6, $7)
          ON CONFLICT (id) DO NOTHING;
        `, item);
      }
    }

    await client.query('COMMIT');

    console.log('------------------------------------------------------------');
    console.log('🎉 Database seeding completed successfully!');
    console.log('Demo accounts seeded:');
    console.log('  Citizen: citizen@nexusclean.org / demo123');
    console.log('  Admin:   admin@nexusclean.org   / demo123');
    console.log('------------------------------------------------------------');
  } catch (error) {
    await client.query('ROLLBACK');
    console.error('Seeding failed:', error);
    process.exit(1);
  } finally {
    await client.end();
  }
}

runSeed();
