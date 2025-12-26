import React from 'react';
import { Link, NavLink } from 'react-router-dom';
import { useAuth } from '../context/AuthContext.jsx';
import { useCart } from '../context/CartContext.jsx';
import logo from '/logo.jpg';

export default function Navbar() {
  const { user, logout } = useAuth();
  const { items } = useCart();
  const cartCount = items.reduce((sum, item) => sum + item.quantity, 0);

  return (
    <nav className="bg-white shadow-md border-b">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          <Link to="/" className="flex items-center gap-3">
            <div className="bg-white p-0.5 rounded-full h-10 w-10 flex items-center justify-center">
              <img src={logo} alt="Logo" className="h-full w-auto rounded-full" />
            </div>
            <span className="text-xl font-bold text-green-700">Sworaj Krishi Farm Pvt.Ltd.</span>
          </Link>
          <div className="flex items-center gap-6">
            <NavLink to="/products" className={({ isActive }) => 
              isActive ? 'text-green-700 font-semibold border-b-2 border-green-700 pb-1' : 'text-gray-700 hover:text-green-600 transition-colors'
            }>
              Products
            </NavLink>
            {user && !user.is_admin && (
              <NavLink to="/cart" className={({ isActive }) => 
                `relative ${isActive ? 'text-green-700 font-semibold border-b-2 border-green-700 pb-1' : 'text-gray-700 hover:text-green-600 transition-colors'}`
              }>
                Cart
                {cartCount > 0 && (
                  <span className="absolute -top-2 -right-2 bg-red-500 text-white text-xs rounded-full h-5 w-5 flex items-center justify-center font-bold">
                    {cartCount}
                  </span>
                )}
              </NavLink>
            )}
            {user ? (
              <>
                <NavLink to="/profile" className={({ isActive }) => 
                  isActive ? 'text-green-700 font-semibold border-b-2 border-green-700 pb-1' : 'text-gray-700 hover:text-green-600 transition-colors'
                }>
                  {user.username}
                </NavLink>
                {user.is_admin && (
                  <NavLink to="/admin" className={({ isActive }) => 
                    isActive ? 'text-green-700 font-semibold border-b-2 border-green-700 pb-1' : 'text-gray-700 hover:text-green-600 transition-colors'
                  }>
                    Admin
                  </NavLink>
                )}
                <button 
                  onClick={logout} 
                  className="px-4 py-2 bg-red-500 text-white rounded-md hover:bg-red-600 transition-colors text-sm font-medium"
                >
                  Logout
                </button>
              </>
            ) : (
              <>
                <NavLink to="/login" className={({ isActive }) => 
                  isActive ? 'text-green-700 font-semibold border-b-2 border-green-700 pb-1' : 'text-gray-700 hover:text-green-600 transition-colors'
                }>
                  Login
                </NavLink>
                <NavLink to="/signup" className={({ isActive }) => 
                  isActive ? 'px-4 py-2 bg-green-600 text-white rounded-md' : 'px-4 py-2 bg-green-500 text-white rounded-md hover:bg-green-600 transition-colors'
                }>
                  Signup
                </NavLink>
              </>
            )}
          </div>
        </div>
      </div>
    </nav>
  );
}
