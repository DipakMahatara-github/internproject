import { pool } from '../config/db.js';

export async function createUser({ username, email, passwordHash, isAdmin = 0 }) {
  const [result] = await pool.execute(
    'INSERT INTO users (username, email, password_hash, is_admin) VALUES (?, ?, ?, ?)',
    [username, email, passwordHash, isAdmin]
  );
  return { id: result.insertId, username, email, is_admin: isAdmin };
}

export async function findUserByEmail(email) {
  const [rows] = await pool.execute('SELECT * FROM users WHERE email = ?', [email]);
  return rows[0] || null;
}

export async function findUserById(id) {
  const [rows] = await pool.execute('SELECT id, username, email, is_admin, created_at FROM users WHERE id = ?', [id]);
  return rows[0] || null;
}
