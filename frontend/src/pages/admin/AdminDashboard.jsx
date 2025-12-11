import React from 'react';
import { Link } from 'react-router-dom';

export default function AdminDashboard() {
  return (
    <div className="space-y-3">
      <h1 className="text-lg font-semibold mb-2">Admin Panel</h1>
      <div className="flex flex-col gap-2 max-w-sm">
        <Link to="/admin/products" className="border rounded px-3 py-2 bg-white text-sm">
          Manage Products
        </Link>
        <Link to="/admin/categories" className="border rounded px-3 py-2 bg-white text-sm">
          Manage Categories
        </Link>
        <Link to="/admin/orders" className="border rounded px-3 py-2 bg-white text-sm">
          View Orders
        </Link>
      </div>
    </div>
  );
}
