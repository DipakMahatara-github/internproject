import { pool } from '../config/db.js';

export async function getAllCategories() {
  const [rows] = await pool.execute('SELECT * FROM categories ORDER BY name ASC');
  return rows;
}

export async function createCategory({ name, description }) {
  const [result] = await pool.execute(
    'INSERT INTO categories (name, description) VALUES (?, ?)',
    [name, description]
  );
  return { id: result.insertId, name, description };
}

export async function updateCategory(id, { name, description }) {
  await pool.execute(
    'UPDATE categories SET name = ?, description = ? WHERE id = ?',
    [name, description, id]
  );
}

export async function deleteCategory(id) {
  await pool.execute('DELETE FROM categories WHERE id = ?', [id]);
}
