import { pool } from '../config/db.js';

export async function getOrCreateCart(userId) {
  const [rows] = await pool.execute('SELECT * FROM carts WHERE user_id = ?', [userId]);
  if (rows.length > 0) return rows[0];
  const [result] = await pool.execute('INSERT INTO carts (user_id) VALUES (?)', [userId]);
  return { id: result.insertId, user_id: userId };
}

export async function getCartItemsDetailed(userId) {
  const [rows] = await pool.execute(
    `SELECT ci.id as cart_item_id, ci.quantity,
            p.id as product_id, p.name, p.price, p.discount, p.image_path
     FROM cart_items ci
     JOIN carts c ON ci.cart_id = c.id
     JOIN products p ON ci.product_id = p.id
     WHERE c.user_id = ?`,
    [userId]
  );
  return rows;
}

export async function addOrUpdateCartItem(userId, productId, quantity) {
  const cart = await getOrCreateCart(userId);
  const [existing] = await pool.execute(
    'SELECT id, quantity FROM cart_items WHERE cart_id = ? AND product_id = ?',
    [cart.id, productId]
  );
  if (existing.length > 0) {
    const newQty = existing[0].quantity + quantity;
    await pool.execute('UPDATE cart_items SET quantity = ? WHERE id = ?', [newQty, existing[0].id]);
  } else {
    await pool.execute(
      'INSERT INTO cart_items (cart_id, product_id, quantity) VALUES (?, ?, ?)',
      [cart.id, productId, quantity]
    );
  }
}

export async function updateCartItemQuantity(itemId, quantity) {
  await pool.execute('UPDATE cart_items SET quantity = ? WHERE id = ?', [quantity, itemId]);
}

export async function removeCartItem(itemId) {
  await pool.execute('DELETE FROM cart_items WHERE id = ?', [itemId]);
}

export async function clearCart(userId) {
  const [rows] = await pool.execute('SELECT id FROM carts WHERE user_id = ?', [userId]);
  if (rows.length === 0) return;
  await pool.execute('DELETE FROM cart_items WHERE cart_id = ?', [rows[0].id]);
}
