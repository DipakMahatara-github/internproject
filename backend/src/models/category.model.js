import { pool } from '../config/db.js';

export async function getAllCategories() {
  const result = await pool.query('SELECT * FROM categories ORDER BY name ASC');
  return result.rows;
}

export async function createCategory({ name, description }) {
  const result = await pool.query(
    'INSERT INTO categories (name, description) VALUES ($1, $2) RETURNING id',
    [name, description]
  );
  return { id: result.rows[0].id, name, description };
}

export async function updateCategory(id, { name, description }) {
  await pool.query(
    'UPDATE categories SET name = $1, description = $2 WHERE id = $3',
    [name, description, id]
  );
}

export async function deleteCategory(id) {
  await pool.query('DELETE FROM categories WHERE id = $1', [id]);
}
