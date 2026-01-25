import { Pool, PoolClient } from 'pg';
import { logger } from '../utils/logger.js';

let pool: Pool | null = null;

export function getPool(): Pool {
  if (!pool) {
    pool = new Pool({
      connectionString: process.env['DATABASE_URL'],
      max: 20,
      idleTimeoutMillis: 30000,
      connectionTimeoutMillis: 2000,
    });

    pool.on('error', (err) => {
      logger.error('Unexpected error on idle client', err);
    });
  }
  return pool;
}

export async function initDatabase(): Promise<void> {
  const pool = getPool();
  const client = await pool.connect();

  try {
    // Test connection
    await client.query('SELECT NOW()');
    logger.info('Database connection established');
  } finally {
    client.release();
  }
}

export async function query<T>(text: string, params?: unknown[]): Promise<T[]> {
  const pool = getPool();
  const start = Date.now();
  const result = await pool.query(text, params);
  const duration = Date.now() - start;

  logger.debug('Executed query', { text, duration, rows: result.rowCount });

  return result.rows as T[];
}

export async function queryOne<T>(text: string, params?: unknown[]): Promise<T | null> {
  const rows = await query<T>(text, params);
  return rows[0] || null;
}

export async function transaction<T>(
  callback: (client: PoolClient) => Promise<T>
): Promise<T> {
  const pool = getPool();
  const client = await pool.connect();

  try {
    await client.query('BEGIN');
    const result = await callback(client);
    await client.query('COMMIT');
    return result;
  } catch (error) {
    await client.query('ROLLBACK');
    throw error;
  } finally {
    client.release();
  }
}

export async function closeDatabase(): Promise<void> {
  if (pool) {
    await pool.end();
    pool = null;
  }
}
