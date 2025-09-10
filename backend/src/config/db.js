import pkg from 'pg';
const { Pool } = pkg;
import { config } from './config.js';

export const pool = new Pool({
  host: config.db.host,
  user: config.db.user,
  password: config.db.password,
  database: config.db.database,
  port: config.db.port,
  max: 10,
  idleTimeoutMillis: 30000,
  connectionTimeoutMillis: 2000,
});

export async function testConnection() {
  const client = await pool.connect();
  try {
    await client.query('SELECT NOW()');
  } finally {
    client.release();
  }
}
