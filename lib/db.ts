import { Pool, PoolConfig, QueryResult } from 'pg';
import { dbQueryDurationMicroseconds } from '@/lib/metrics';
import logger from '@/lib/logger';

let pool: Pool | null = null;

function stripQuotes(str: string | undefined): string | undefined {
  if (!str) return str;
  return str.replace(/^"(.*)"$/, '$1').replace(/^'(.*)'$/, '$1');
}

async function tryPool(config: PoolConfig): Promise<Pool> {
  const testPool = new Pool(config);
  try {
    await testPool.query('SELECT 1');
    return testPool;
  } catch (e) {
    await testPool.end().catch(() => {});
    throw e;
  }
}

export async function getPool(): Promise<Pool> {
  if (pool) return pool;

  // Try credentials method
  const {
    TIMESCALEDB_HOST,
    TIMESCALEDB_PORT,
    TIMESCALEDB_DATABASE,
    TIMESCALEDB_USER,
    TIMESCALEDB_PASSWORD,
    DATABASE_URL
  } = process.env;

  let lastError: any = null;

  if (
    TIMESCALEDB_HOST &&
    TIMESCALEDB_PORT &&
    TIMESCALEDB_DATABASE &&
    TIMESCALEDB_USER &&
    TIMESCALEDB_PASSWORD
  ) {
    try {
      const config: PoolConfig = {
        host: TIMESCALEDB_HOST,
        port: parseInt(TIMESCALEDB_PORT, 10),
        database: TIMESCALEDB_DATABASE,
        user: TIMESCALEDB_USER,
        password: stripQuotes(TIMESCALEDB_PASSWORD),
        ssl: { rejectUnauthorized: false },
        max: 10,
        min: 0,
        idleTimeoutMillis: 10000,
        connectionTimeoutMillis: 5000,
        statement_timeout: 30000,
        query_timeout: 30000,
        application_name: 'camarin-analytics-dashboard'
      };
      pool = await tryPool(config);
      setupPoolEventHandlers(pool);
      return pool;
    } catch (e) {
      lastError = e;
      // Fall through to try DATABASE_URL
    }
  }

  // Try DATABASE_URL method
  if (DATABASE_URL) {
    try {
      const config: PoolConfig = {
        connectionString: DATABASE_URL,
        ssl: { rejectUnauthorized: false },
        max: 10,
        min: 0,
        idleTimeoutMillis: 10000,
        connectionTimeoutMillis: 5000,
        statement_timeout: 30000,
        query_timeout: 30000,
        application_name: 'camarin-analytics-dashboard'
      };
      pool = await tryPool(config);
      setupPoolEventHandlers(pool);
      return pool;
    } catch (e) {
      lastError = e;
    }
  }

  // If both methods fail
  throw new Error(
    `Failed to connect to TimescaleDB using both credentials and DATABASE_URL. Last error: ${
      lastError instanceof Error ? lastError.message : String(lastError)
    }`
  );
}

function setupPoolEventHandlers(currentPool: Pool) {
  currentPool.on('error', (err) => {
    logger.error('Database pool error:', err);
  });
  currentPool.on('connect', (client) => {
    client.on('error', (err) => {
      logger.error('Database client error:', err);
    });
  });
}

export async function query(text: string, params?: any[]): Promise<QueryResult<any>> {
  const queryName = text.trim().split(' ')[0].toLowerCase(); 
  const end = dbQueryDurationMicroseconds.startTimer({ query_name: queryName }); 

  const startTime = Date.now();
  const currentPool = await getPool();
  try {
    const result = await currentPool.query(text, params);
    const duration = Date.now() - startTime;
    logger.info(`Query completed in ${duration}ms. Rows returned: ${result.rows.length}`);
    end(); 
    return result;
  } catch (error) {
    const duration = Date.now() - startTime;
    logger.error(`Database query error after ${duration}ms: ${error}`, error);
    end(); 
    throw new Error(`Database query failed: ${error instanceof Error ? error.message : String(error)}`);
  }
}

export async function testConnection(): Promise<boolean> {
  try {
    const result = await query('SELECT NOW() as current_time, version() as db_version');
    logger.info(`Database connection test successful: ${result.rows[0]}`);
    return true;
  } catch (error) {
    logger.error('Database connection test failed:', error);
    return false;
  }
}

export async function endPool() {
  if (pool) {
    await pool.end();
    pool = null;
    logger.info('Database pool closed');
  }
}