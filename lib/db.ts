import { Pool } from 'pg';

let pool: Pool | null = null;

export function getPool(): Pool {
  if (!pool) {
    pool = new Pool({
      host: process.env.TIMESCALEDB_HOST,
      port: parseInt(process.env.TIMESCALEDB_PORT!),
      database: process.env.TIMESCALEDB_NAME,
      user: process.env.TIMESCALEDB_USER,
      password: process.env.TIMESCALEDB_PASSWORD,
      ssl: false,
      max: 20,
      idleTimeoutMillis: 30000,
      connectionTimeoutMillis: 2000,
    });
  }
  return pool;
}

export async function query(text: string, params?: any[]) {
  const client = getPool();
  try {
    const result = await client.query(text, params);
    return result;
  } catch (error) {
    console.error('Database query error:', error);
    throw error;
  }
}

export async function endPool() {
  if (pool) {
    await pool.end();
    pool = null;
  }
}