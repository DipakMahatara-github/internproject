import { pool } from '../config/db.js';

export async function getReviewsByProduct(productId) {
  const [rows] = await pool.execute(
    `SELECT r.*, u.username
     FROM reviews r
     JOIN users u ON r.user_id = u.id
     WHERE r.product_id = ?
     ORDER BY r.created_at DESC`,
    [productId]
  );
  return rows;
}

export async function upsertReview({ userId, productId, rating, comment }) {
  const [existing] = await pool.execute(
    'SELECT id FROM reviews WHERE user_id = ? AND product_id = ?',
    [userId, productId]
  );

  if (existing.length > 0) {
    await pool.execute(
      'UPDATE reviews SET rating = ?, comment = ? WHERE id = ?',
      [rating, comment, existing[0].id]
    );
    return existing[0].id;
  } else {
    const [result] = await pool.execute(
      'INSERT INTO reviews (user_id, product_id, rating, comment) VALUES (?, ?, ?, ?)',
      [userId, productId, rating, comment]
    );
    return result.insertId;
  }
}
