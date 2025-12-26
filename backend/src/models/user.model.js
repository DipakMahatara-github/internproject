import { pool } from '../config/db.js';

export async function createUser({ username, email, passwordHash, isAdmin = 0 }) {
  const result = await pool.query(
    'INSERT INTO users (username, email, password_hash, is_admin) VALUES ($1, $2, $3, $4) RETURNING id',
    [username, email, passwordHash, isAdmin]
  );
  return { id: result.rows[0].id, username, email, is_admin: isAdmin };
}

export async function findUserByEmail(email) {
  const result = await pool.query('SELECT * FROM users WHERE email = $1', [email]);
  return result.rows[0] || null;
}

export async function findUserById(id) {
  const result = await pool.query('SELECT id, username, email, is_admin, created_at FROM users WHERE id = $1', [id]);
  return result.rows[0] || null;
}
