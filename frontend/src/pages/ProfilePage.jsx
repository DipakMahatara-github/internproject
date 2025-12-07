import React, { useEffect, useState } from 'react';
import { useAuth } from '../context/AuthContext.jsx';
import { fetchMyOrders } from '../services/orderService.js';

export default function ProfilePage() {
  const { user, token } = useAuth();
  const [orders, setOrders] = useState([]);

  useEffect(() => {
    async function load() {
      if (!token) return;
      const data = await fetchMyOrders(token);
      setOrders(data);
    }
    load();
  }, [token]);

  return (
    <div className="space-y-4">
      <section>
        <h1 className="text-lg font-semibold mb-1">Profile</h1>
        <p className="text-sm text-gray-700">Username: {user.username}</p>
        <p className="text-sm text-gray-700">Email: {user.email}</p>
      </section>
      <section>
        <h2 className="text-md font-semibold mb-2">Order History</h2>
        <div className="space-y-3">
          {orders.map((o) => (
            <div key={o.id} className="border rounded p-2 bg-white text-sm">
              <div className="flex justify-between mb-1">
                <span>Order #{o.id}</span>
                <span className="uppercase text-xs text-gray-500">{o.status}</span>
              </div>
              <ul className="list-disc list-inside text-gray-700">
                {o.items?.map((it) => (
                  <li key={it.id}>{it.quantity} x {it.name} (NPR {it.price})</li>
                ))}
              </ul>
            </div>
          ))}
          {orders.length === 0 && <p className="text-sm text-gray-500">No orders yet.</p>}
        </div>
      </section>
    </div>
  );
}
