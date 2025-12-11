import React, { useEffect, useState } from 'react';
import { useAuth } from '../../context/AuthContext.jsx';
import { fetchAllOrders, updateOrderStatus } from '../../services/orderService.js';

export default function AdminOrdersPage() {
  const { token } = useAuth();
  const [orders, setOrders] = useState([]);

  const load = async () => {
    const data = await fetchAllOrders(token);
    setOrders(data);
  };

  useEffect(() => {
    if (token) load();
  }, [token]);

  const handleStatusChange = async (id, status) => {
    await updateOrderStatus(token, id, status);
    await load();
  };

  const statuses = ['PENDING', 'CONFIRMED', 'SHIPPED', 'CANCELLED'];

  return (
    <div className="space-y-3">
      <h1 className="text-lg font-semibold mb-2">All Orders</h1>
      <div className="space-y-2 text-sm max-h-[28rem] overflow-y-auto">
        {orders.map((o) => (
          <div key={o.id} className="border rounded p-2 bg-white">
            <div className="flex justify-between mb-1">
              <div>
                <p>Order #{o.id}</p>
                <p className="text-xs text-gray-500">{o.username} ({o.email})</p>
              </div>
              <select
                value={o.status}
                onChange={(e) => handleStatusChange(o.id, e.target.value)}
                className="border rounded px-2 py-1 text-xs"
              >
                {statuses.map((s) => (
                  <option key={s} value={s}>{s}</option>
                ))}
              </select>
            </div>
          </div>
        ))}
        {orders.length === 0 && <p className="text-sm text-gray-500">No orders yet.</p>}
      </div>
    </div>
  );
}
