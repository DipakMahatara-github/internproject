import React from 'react';
import { useCart } from '../context/CartContext.jsx';
import { useAuth } from '../context/AuthContext.jsx';
import { createOrder } from '../services/orderService.js';

export default function CartPage() {
  const { items, updateItemQty, removeItem, clear } = useCart();
  const { token } = useAuth();

  const total = items.reduce((sum, item) => {
    const price = item.price * (1 - (item.discount || 0) / 100);
    return sum + price * item.quantity;
  }, 0);

  const handleCheckout = async () => {
    if (!token) return;
    await createOrder(token);
    await clear();
  };

  return (
    <div>
      <h1 className="text-lg font-semibold mb-3">Your Cart</h1>
      {items.length === 0 ? (
        <p>Your cart is empty.</p>
      ) : (
        <div className="space-y-3">
          {items.map((item) => (
            <div key={item.cart_item_id} className="flex items-center justify-between border rounded p-2 bg-white">
              <div className="flex items-center gap-3">
                {item.image_path && (
                  <img
                    src={`http://localhost:5000${item.image_path}`}
                    alt={item.name}
                    className="h-12 w-12 object-cover rounded"
                  />
                )}
                <div>
                  <p className="font-medium text-sm">{item.name}</p>
                  <p className="text-xs text-gray-500">
                    ${item.price} - {item.discount || 0}% off
                  </p>
                </div>
              </div>
              <div className="flex items-center gap-3">
                <input
                  type="number"
                  min="1"
                  value={item.quantity}
                  onChange={(e) => updateItemQty(item.cart_item_id, Number(e.target.value))}
                  className="w-16 border rounded px-1 text-sm"
                />
                <button
                  onClick={() => removeItem(item.cart_item_id)}
                  className="text-xs text-red-500"
                >
                  Remove
                </button>
              </div>
            </div>
          ))}
          <div className="flex justify-between items-center mt-4">
            <span className="font-semibold">Total: ${total.toFixed(2)}</span>
            <button
              onClick={handleCheckout}
              className="px-4 py-2 bg-green-600 text-white rounded text-sm"
            >
              Checkout (manual)
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
