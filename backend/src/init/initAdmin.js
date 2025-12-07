import bcrypt from 'bcrypt';
import { pool } from '../config/db.js';

async function initAdmin() {
  const email = 'admin@sworaj.com.np';
  const username = 'admin';
  const password = 'admin123';

  const result = await pool.query('SELECT id FROM users WHERE email = $1', [email]);
  if (result.rows.length > 0) {
    console.log('Admin already exists');
    process.exit(0);
  }

  const passwordHash = await bcrypt.hash(password, 10);
  const insertResult = await pool.query(
    'INSERT INTO users (username, email, password_hash, is_admin) VALUES ($1, $2, $3, true) RETURNING id',
    [username, email, passwordHash]
  );
  console.log('Admin created with id', insertResult.rows[0].id);
  console.log('Email:', email, 'Password:', password);
  process.exit(0);
}

initAdmin().catch(err => {
  console.error('Failed to init admin:', err);
  process.exit(1);
});
