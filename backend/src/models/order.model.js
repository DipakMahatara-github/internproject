import { pool } from '../config/db.js';

export async function createOrderFromCart(userId) {
  const client = await pool.connect();
  try {
    await client.query('BEGIN');

    const cartResult = await client.query('SELECT id FROM carts WHERE user_id = $1', [userId]);
    if (cartResult.rows.length === 0) {
      throw Object.assign(new Error('Cart is empty'), { status: 400 });
    }
    const cartId = cartResult.rows[0].id;

    const itemsResult = await client.query(
      `SELECT ci.product_id, ci.quantity, p.price
       FROM cart_items ci
       JOIN products p ON ci.product_id = p.id
       WHERE ci.cart_id = $1`,
      [cartId]
    );

    if (itemsResult.rows.length === 0) {
      throw Object.assign(new Error('Cart is empty'), { status: 400 });
    }

    const orderResult = await client.query(
      'INSERT INTO orders (user_id) VALUES ($1) RETURNING id',
      [userId]
    );
    const orderId = orderResult.rows[0].id;

    for (const item of itemsResult.rows) {
      await client.query(
        'INSERT INTO order_items (order_id, product_id, quantity, price) VALUES ($1, $2, $3, $4)',
        [orderId, item.product_id, item.quantity, item.price]
      );
    }

    await client.query('DELETE FROM cart_items WHERE cart_id = $1', [cartId]);

    await client.query('COMMIT');
    return orderId;
  } catch (err) {
    await client.query('ROLLBACK');
    throw err;
  } finally {
    client.release();
  }
}

export async function getUserOrders(userId) {
  const ordersResult = await pool.query(
    'SELECT * FROM orders WHERE user_id = $1 ORDER BY created_at DESC',
    [userId]
  );

  for (const order of ordersResult.rows) {
    const itemsResult = await pool.query(
      `SELECT oi.*, p.name, p.image_path
       FROM order_items oi
       JOIN products p ON oi.product_id = p.id
       WHERE oi.order_id = $1`,
      [order.id]
    );
    order.items = itemsResult.rows;
  }

  return ordersResult.rows;
}

export async function getAllOrders() {
  const result = await pool.query(
    `SELECT o.*, u.username, u.email
     FROM orders o
     JOIN users u ON o.user_id = u.id
     ORDER BY o.created_at DESC`
  );
  return result.rows;
}

export async function updateOrderStatus(orderId, status) {
  await pool.query('UPDATE orders SET status = $1 WHERE id = $2', [status, orderId]);
}
