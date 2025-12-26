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
    <div className="max-w-4xl mx-auto">
      <h1 className="text-3xl font-bold mb-6 text-gray-800">Shopping Cart</h1>
      {items.length === 0 ? (
        <div className="bg-white rounded-lg shadow-lg p-12 text-center">
          <p className="text-xl text-gray-600 mb-4">Your cart is empty.</p>
          <a href="/products" className="inline-block px-6 py-3 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors font-medium">
            Browse Products
          </a>
        </div>
      ) : (
        <div className="space-y-4">
          <div className="bg-white rounded-lg shadow-lg p-6">
            {items.map((item) => {
              const itemPrice = item.price * (1 - (item.discount || 0) / 100);
              const itemTotal = itemPrice * item.quantity;
              return (
                <div key={item.cart_item_id} className="flex items-center justify-between border-b border-gray-200 pb-4 mb-4 last:border-0 last:mb-0">
                  <div className="flex items-center gap-4 flex-1">
                    {item.image_path && (
                      <img
                        src={`http://localhost:5000${item.image_path}`}
                        alt={item.name}
                        className="h-20 w-20 object-cover rounded-lg border border-gray-200"
                      />
                    )}
                    <div className="flex-1">
                      <p className="font-semibold text-gray-800">{item.name}</p>
                      <p className="text-sm text-gray-500 mt-1">
                        NPR {itemPrice.toFixed(2)} each
                        {item.discount > 0 && (
                          <span className="ml-2 text-green-600">({item.discount}% off)</span>
                        )}
                      </p>
                    </div>
                  </div>
                  <div className="flex items-center gap-4">
                    <div className="flex items-center gap-2">
                      <label className="text-sm text-gray-600">Qty:</label>
                      <input
                        type="number"
                        min="1"
                        value={item.quantity}
                        onChange={(e) => updateItemQty(item.cart_item_id, Number(e.target.value))}
                        className="w-20 border border-gray-300 rounded-lg px-2 py-1 text-center focus:ring-2 focus:ring-green-500 focus:border-transparent"
                      />
                    </div>
                    <span className="font-semibold text-gray-800 w-24 text-right">
                      NPR {itemTotal.toFixed(2)}
                    </span>
                    <button
                      onClick={() => removeItem(item.cart_item_id)}
                      className="px-3 py-1 bg-red-500 text-white rounded-lg hover:bg-red-600 transition-colors text-sm font-medium"
                    >
                      Remove
                    </button>
                  </div>
                </div>
              );
            })}
          </div>
          <div className="bg-green-50 rounded-lg shadow-lg p-6">
            <div className="flex justify-between items-center mb-4">
              <span className="text-xl font-semibold text-gray-800">Total:</span>
              <span className="text-2xl font-bold text-green-700">NPR {total.toFixed(2)}</span>
            </div>
            <button
              onClick={handleCheckout}
              className="w-full px-6 py-3 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors font-bold text-lg shadow-md"
            >
              Proceed to Checkout
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
