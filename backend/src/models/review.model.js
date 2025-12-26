import { pool } from '../config/db.js';

export async function getReviewsByProduct(productId) {
  const result = await pool.query(
    `SELECT r.*, u.username
     FROM reviews r
     JOIN users u ON r.user_id = u.id
     WHERE r.product_id = $1
     ORDER BY r.created_at DESC`,
    [productId]
  );
  return result.rows;
}

export async function upsertReview({ userId, productId, rating, comment }) {
  const existingResult = await pool.query(
    'SELECT id FROM reviews WHERE user_id = $1 AND product_id = $2',
    [userId, productId]
  );

  if (existingResult.rows.length > 0) {
    await pool.query(
      'UPDATE reviews SET rating = $1, comment = $2 WHERE id = $3',
      [rating, comment, existingResult.rows[0].id]
    );
    return existingResult.rows[0].id;
  } else {
    const result = await pool.query(
      'INSERT INTO reviews (user_id, product_id, rating, comment) VALUES ($1, $2, $3, $4) RETURNING id',
      [userId, productId, rating, comment]
    );
    return result.rows[0].id;
  }
}
