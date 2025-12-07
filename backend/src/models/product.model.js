import { pool } from '../config/db.js';

export async function getProducts({ offset, limit, categoryId, search, sort }) {
  const params = [];
  let paramIndex = 1;
  let where = 'WHERE 1=1';

  if (categoryId) {
    where += ` AND p.category_id = $${paramIndex}`;
    params.push(categoryId);
    paramIndex++;
  }
  if (search) {
    where += ` AND p.name LIKE $${paramIndex}`;
    params.push(`%${search}%`);
    paramIndex++;
  }

  let orderBy = 'ORDER BY p.created_at DESC';
  if (sort === 'price_asc') orderBy = 'ORDER BY p.price ASC';
  if (sort === 'price_desc') orderBy = 'ORDER BY p.price DESC';

  let limitClause = '';
  if (limit) {
    limitClause = `LIMIT $${paramIndex}`;
    params.push(limit);
    paramIndex++;
  }
  if (offset && limit) {
    limitClause += ` OFFSET $${paramIndex}`;
    params.push(offset);
    paramIndex++;
  }

  const itemsResult = await pool.query(
    `SELECT p.*, c.name as category_name,
            COALESCE(AVG(r.rating), 0) as avg_rating,
            COUNT(r.id) as review_count
     FROM products p
     JOIN categories c ON p.category_id = c.id
     LEFT JOIN reviews r ON r.product_id = p.id
     ${where}
     GROUP BY p.id, c.id, c.name
     ${orderBy}
     ${limitClause}
     `,
    params
  );

  // For count query, we need to adjust the where clause without p. prefix
  let countWhere = 'WHERE 1=1';
  const countParams = [];
  let countParamIndex = 1;
  if (categoryId) {
    countWhere += ` AND category_id = $${countParamIndex}`;
    countParams.push(categoryId);
    countParamIndex++;
  }
  if (search) {
    countWhere += ` AND name LIKE $${countParamIndex}`;
    countParams.push(`%${search}%`);
    countParamIndex++;
  }

  const countResult = await pool.query(
    `SELECT COUNT(*) as total
     FROM products
     ${countWhere}`,
    countParams
  );

  return { items: itemsResult.rows, total: parseInt(countResult.rows[0].total) };
}

export async function getProductById(id) {
  const result = await pool.query(
    `SELECT p.*, c.name as category_name,
            COALESCE(AVG(r.rating), 0) as avg_rating,
            COUNT(r.id) as review_count
     FROM products p
     JOIN categories c ON p.category_id = c.id
     LEFT JOIN reviews r ON r.product_id = p.id
     WHERE p.id = $1
     GROUP BY p.id, c.id, c.name`,
    [id]
  );
  return result.rows[0] || null;
}

export async function createProduct({ category_id, name, description, price, discount, image_path }) {
  const result = await pool.query(
    'INSERT INTO products (category_id, name, description, price, discount, image_path) VALUES ($1, $2, $3, $4, $5, $6) RETURNING id',
    [category_id, name, description, price, discount || 0, image_path]
  );
  return { id: result.rows[0].id };
}

export async function updateProduct(id, { category_id, name, description, price, discount, image_path }) {
  const fields = [];
  const params = [];
  let paramIndex = 1;

  fields.push(`category_id = $${paramIndex++}`);
  params.push(category_id);
  fields.push(`name = $${paramIndex++}`);
  params.push(name);
  fields.push(`description = $${paramIndex++}`);
  params.push(description);
  fields.push(`price = $${paramIndex++}`);
  params.push(price);
  fields.push(`discount = $${paramIndex++}`);
  params.push(discount || 0);

  if (image_path) {
    fields.push(`image_path = $${paramIndex++}`);
    params.push(image_path);
  }
  
  params.push(id);
  const whereParamIndex = paramIndex;
  
  await pool.query(`UPDATE products SET ${fields.join(', ')} WHERE id = $${whereParamIndex}`, params);
}

export async function deleteProduct(id) {
  await pool.query('DELETE FROM products WHERE id = $1', [id]);
}
