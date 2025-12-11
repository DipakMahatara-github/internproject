import React from 'react';
import { Link, NavLink } from 'react-router-dom';
import { useAuth } from '../context/AuthContext.jsx';
import { useCart } from '../context/CartContext.jsx';

export default function Navbar() {
  const { user, logout } = useAuth();
  const { items } = useCart();
  const cartCount = items.reduce((sum, item) => sum + item.quantity, 0);

  return (
    <nav className="bg-white shadow-sm">
      <div className="max-w-6xl mx-auto px-4 py-3 flex items-center justify-between">
        <Link to="/" className="text-xl font-semibold text-green-700">Milan Wholesale</Link>
        <div className="flex items-center gap-4">
          <NavLink to="/products" className={({ isActive }) => isActive ? 'text-green-700 font-medium' : 'text-gray-700'}>
            Products
          </NavLink>
          <NavLink to="/cart" className={({ isActive }) => isActive ? 'text-green-700 font-medium' : 'text-gray-700'}>
            Cart ({cartCount})
          </NavLink>
          {user ? (
            <>
              <NavLink to="/profile" className={({ isActive }) => isActive ? 'text-green-700 font-medium' : 'text-gray-700'}>
                {user.username}
              </NavLink>
              {user.is_admin && (
                <NavLink to="/admin" className={({ isActive }) => isActive ? 'text-green-700 font-medium' : 'text-gray-700'}>
                  Admin
                </NavLink>
              )}
              <button onClick={logout} className="text-gray-600 text-sm">Logout</button>
            </>
          ) : (
            <>
              <NavLink to="/login" className={({ isActive }) => isActive ? 'text-green-700 font-medium' : 'text-gray-700'}>
                Login
              </NavLink>
              <NavLink to="/signup" className={({ isActive }) => isActive ? 'text-green-700 font-medium' : 'text-gray-700'}>
                Signup
              </NavLink>
            </>
          )}
        </div>
      </div>
    </nav>
  );
}
