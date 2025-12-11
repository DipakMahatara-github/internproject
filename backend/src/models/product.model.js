import { pool } from '../config/db.js';

export async function getProducts({ offset, limit, categoryId, search, sort }) {
  const params = [];
  let where = 'WHERE 1=1';

  if (categoryId) {
    where += ' AND p.category_id = ?';
    params.push(categoryId);
  }
  if (search) {
    where += ' AND p.name LIKE ?';
    params.push(`%${search}%`);
  }

  let orderBy = 'ORDER BY p.created_at DESC';
  if (sort === 'price_asc') orderBy = 'ORDER BY p.price ASC';
  if (sort === 'price_desc') orderBy = 'ORDER BY p.price DESC';

  const [items] = await pool.execute(
    `SELECT p.*, c.name as category_name,
            COALESCE(AVG(r.rating), 0) as avg_rating,
            COUNT(r.id) as review_count
     FROM products p
     JOIN categories c ON p.category_id = c.id
     LEFT JOIN reviews r ON r.product_id = p.id
     ${where}
     GROUP BY p.id
     ${orderBy}
     LIMIT ? OFFSET ?`,
    [...params, limit, offset]
  );

  const [countRows] = await pool.execute(
    `SELECT COUNT(*) as total
     FROM products p
     ${where.replace('p.', '')}`,
    params
  );

  return { items, total: countRows[0].total };
}

export async function getProductById(id) {
  const [rows] = await pool.execute(
    `SELECT p.*, c.name as category_name,
            COALESCE(AVG(r.rating), 0) as avg_rating,
            COUNT(r.id) as review_count
     FROM products p
     JOIN categories c ON p.category_id = c.id
     LEFT JOIN reviews r ON r.product_id = p.id
     WHERE p.id = ?
     GROUP BY p.id`,
    [id]
  );
  return rows[0] || null;
}

export async function createProduct({ category_id, name, description, price, discount, image_path }) {
  const [result] = await pool.execute(
    'INSERT INTO products (category_id, name, description, price, discount, image_path) VALUES (?, ?, ?, ?, ?, ?)',
    [category_id, name, description, price, discount || 0, image_path]
  );
  return { id: result.insertId };
}

export async function updateProduct(id, { category_id, name, description, price, discount, image_path }) {
  const fields = ['category_id = ?', 'name = ?', 'description = ?', 'price = ?', 'discount = ?'];
  const params = [category_id, name, description, price, discount || 0];
  if (image_path) {
    fields.push('image_path = ?');
    params.push(image_path);
  }
  params.push(id);
  await pool.execute(`UPDATE products SET ${fields.join(', ')} WHERE id = ?`, params);
}

export async function deleteProduct(id) {
  await pool.execute('DELETE FROM products WHERE id = ?', [id]);
}
