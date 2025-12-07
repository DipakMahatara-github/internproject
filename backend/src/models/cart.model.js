import { pool } from '../config/db.js';

export async function getOrCreateCart(userId) {
  const result = await pool.query('SELECT * FROM carts WHERE user_id = $1', [userId]);
  if (result.rows.length > 0) return result.rows[0];
  const insertResult = await pool.query('INSERT INTO carts (user_id) VALUES ($1) RETURNING id', [userId]);
  return { id: insertResult.rows[0].id, user_id: userId };
}

export async function getCartItemsDetailed(userId) {
  const result = await pool.query(
    `SELECT ci.id as cart_item_id, ci.quantity,
            p.id as product_id, p.name, p.price, p.discount, p.image_path
     FROM cart_items ci
     JOIN carts c ON ci.cart_id = c.id
     JOIN products p ON ci.product_id = p.id
     WHERE c.user_id = $1`,
    [userId]
  );
  return result.rows;
}

export async function addOrUpdateCartItem(userId, productId, quantity) {
  const cart = await getOrCreateCart(userId);
  const existingResult = await pool.query(
    'SELECT id, quantity FROM cart_items WHERE cart_id = $1 AND product_id = $2',
    [cart.id, productId]
  );
  if (existingResult.rows.length > 0) {
    const newQty = existingResult.rows[0].quantity + quantity;
    await pool.query('UPDATE cart_items SET quantity = $1 WHERE id = $2', [newQty, existingResult.rows[0].id]);
  } else {
    await pool.query(
      'INSERT INTO cart_items (cart_id, product_id, quantity) VALUES ($1, $2, $3)',
      [cart.id, productId, quantity]
    );
  }
}

export async function updateCartItemQuantity(itemId, quantity) {
  await pool.query('UPDATE cart_items SET quantity = $1 WHERE id = $2', [quantity, itemId]);
}

export async function removeCartItem(itemId) {
  await pool.query('DELETE FROM cart_items WHERE id = $1', [itemId]);
}

export async function clearCart(userId) {
  const result = await pool.query('SELECT id FROM carts WHERE user_id = $1', [userId]);
  if (result.rows.length === 0) return;
  await pool.query('DELETE FROM cart_items WHERE cart_id = $1', [result.rows[0].id]);
}
