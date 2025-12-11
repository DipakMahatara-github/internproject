import { pool } from '../config/db.js';

export async function createOrderFromCart(userId) {
  const connection = await pool.getConnection();
  try {
    await connection.beginTransaction();

    const [cartRows] = await connection.execute('SELECT id FROM carts WHERE user_id = ?', [userId]);
    if (cartRows.length === 0) {
      throw Object.assign(new Error('Cart is empty'), { status: 400 });
    }
    const cartId = cartRows[0].id;

    const [items] = await connection.execute(
      `SELECT ci.product_id, ci.quantity, p.price
       FROM cart_items ci
       JOIN products p ON ci.product_id = p.id
       WHERE ci.cart_id = ?`,
      [cartId]
    );

    if (items.length === 0) {
      throw Object.assign(new Error('Cart is empty'), { status: 400 });
    }

    const [orderResult] = await connection.execute(
      'INSERT INTO orders (user_id) VALUES (?)',
      [userId]
    );
    const orderId = orderResult.insertId;

    for (const item of items) {
      await connection.execute(
        'INSERT INTO order_items (order_id, product_id, quantity, price) VALUES (?, ?, ?, ?)',
        [orderId, item.product_id, item.quantity, item.price]
      );
    }

    await connection.execute('DELETE FROM cart_items WHERE cart_id = ?', [cartId]);

    await connection.commit();
    return orderId;
  } catch (err) {
    await connection.rollback();
    throw err;
  } finally {
    connection.release();
  }
}

export async function getUserOrders(userId) {
  const [orders] = await pool.execute(
    'SELECT * FROM orders WHERE user_id = ? ORDER BY created_at DESC',
    [userId]
  );

  for (const order of orders) {
    const [items] = await pool.execute(
      `SELECT oi.*, p.name, p.image_path
       FROM order_items oi
       JOIN products p ON oi.product_id = p.id
       WHERE oi.order_id = ?`,
      [order.id]
    );
    order.items = items;
  }

  return orders;
}

export async function getAllOrders() {
  const [orders] = await pool.execute(
    `SELECT o.*, u.username, u.email
     FROM orders o
     JOIN users u ON o.user_id = u.id
     ORDER BY o.created_at DESC`
  );
  return orders;
}

export async function updateOrderStatus(orderId, status) {
  await pool.execute('UPDATE orders SET status = ? WHERE id = ?', [status, orderId]);
}
