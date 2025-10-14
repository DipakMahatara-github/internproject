import React, { createContext, useContext, useEffect, useState } from 'react';
import { useAuth } from './AuthContext.jsx';
import { fetchCart, addToCart as addToCartApi, updateCartItem, removeCartItem, clearCart } from '../services/cartService.js';

const CartContext = createContext(null);

export function CartProvider({ children }) {
  const { token } = useAuth();
  const [items, setItems] = useState([]);

  useEffect(() => {
    async function loadCart() {
      if (!token) {
        setItems([]);
        return;
      }
      try {
        const data = await fetchCart(token);
        setItems(data);
      } catch (err) {
        console.error(err);
      }
    }
    loadCart();
  }, [token]);

  const addItem = async (productId, quantity = 1) => {
    if (!token) return;
    await addToCartApi(token, productId, quantity);
    const data = await fetchCart(token);
    setItems(data);
  };

  const updateItemQty = async (itemId, quantity) => {
    if (!token) return;
    await updateCartItem(token, itemId, quantity);
    const data = await fetchCart(token);
    setItems(data);
  };

  const removeItem = async (itemId) => {
    if (!token) return;
    await removeCartItem(token, itemId);
    const data = await fetchCart(token);
    setItems(data);
  };

  const clear = async () => {
    if (!token) return;
    await clearCart(token);
    setItems([]);
  };

  return (
    <CartContext.Provider value={{ items, addItem, updateItemQty, removeItem, clear }}>
      {children}
    </CartContext.Provider>
  );
}

export function useCart() {
  return useContext(CartContext);
}
