import pg from 'pg';
import { config } from './env.js';

const { Pool } = pg;

let pool = null;

if (config.databaseUrl) {
  const isCloudHost = config.nodeEnv === 'production' || 
    config.databaseUrl.includes('supabase.co') || 
    config.databaseUrl.includes('render.com') ||
    config.databaseUrl.includes('neon.tech') ||
    config.databaseUrl.includes('railway.app') ||
    config.databaseUrl.includes('sslmode=require');

  pool = new Pool({
    connectionString: config.databaseUrl,
    ssl: isCloudHost ? { rejectUnauthorized: false } : false,
    max: 20, // Maximum active connections in pool
    idleTimeoutMillis: 30000,
    connectionTimeoutMillis: 5000
  });

  pool.on('error', (err) => {
    console.error('[PostgreSQL Pool Error]: Unexpected client error', err.message);
  });

  console.log('[PostgreSQL] Database pool initialized for:', config.databaseUrl.split('@')[1] || 'configured connection');
}

export const db = {
  isConfigured: () => Boolean(pool),

  async query(text, params) {
    if (!pool) {
      throw new Error('Database pool is not configured. Set DATABASE_URL.');
    }
    const start = Date.now();
    try {
      const res = await pool.query(text, params);
      const duration = Date.now() - start;
      if (config.nodeEnv === 'development' && duration > 100) {
        console.log(`[PostgreSQL] Slow query (${duration}ms):`, text);
      }
      return res;
    } catch (err) {
      console.error('[PostgreSQL Query Error]:', err.message, { text, params });
      throw err;
    }
  },

  async getClient() {
    if (!pool) {
      throw new Error('Database pool is not configured. Set DATABASE_URL.');
    }
    return await pool.connect();
  },

  async testConnection() {
    if (!pool) return false;
    try {
      const res = await pool.query('SELECT NOW() as current_time');
      return Boolean(res.rows[0]?.current_time);
    } catch (err) {
      console.error('[PostgreSQL Connection Test Failed]:', err.message);
      return false;
    }
  },

  async close() {
    if (pool) {
      await pool.end();
      pool = null;
    }
  }
};
