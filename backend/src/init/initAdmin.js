import bcrypt from 'bcrypt';
import { pool } from '../config/db.js';

async function initAdmin() {
  const email = 'admin@milan.local';
  const username = 'admin';
  const password = 'admin123';

  const [rows] = await pool.execute('SELECT id FROM users WHERE email = ?', [email]);
  if (rows.length > 0) {
    console.log('Admin already exists');
    process.exit(0);
  }

  const passwordHash = await bcrypt.hash(password, 10);
  const [result] = await pool.execute(
    'INSERT INTO users (username, email, password_hash, is_admin) VALUES (?, ?, ?, 1)',
    [username, email, passwordHash]
  );
  console.log('Admin created with id', result.insertId);
  console.log('Email:', email, 'Password:', password);
  process.exit(0);
}

initAdmin().catch(err => {
  console.error('Failed to init admin:', err);
  process.exit(1);
});
