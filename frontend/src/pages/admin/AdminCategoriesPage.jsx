import React, { useEffect, useState } from 'react';
import { useAuth } from '../../context/AuthContext.jsx';
import api, { withAuth } from '../../services/api.js';
import { fetchCategories } from '../../services/productService.js';

export default function AdminCategoriesPage() {
  const { token } = useAuth();
  const [categories, setCategories] = useState([]);
  const [name, setName] = useState('');
  const [description, setDescription] = useState('');
  const [editingId, setEditingId] = useState(null);

  const load = async () => {
    const cats = await fetchCategories();
    setCategories(cats);
  };

  useEffect(() => {
    load();
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();
    const client = withAuth(token);
    if (editingId) {
      await client.put(`/categories/${editingId}`, { name, description });
    } else {
      await client.post('/categories', { name, description });
    }
    setName('');
    setDescription('');
    setEditingId(null);
    await load();
  };

  const handleEdit = (c) => {
    setEditingId(c.id);
    setName(c.name);
    setDescription(c.description || '');
  };

  const handleDelete = async (id) => {
    const client = withAuth(token);
    await client.delete(`/categories/${id}`);
    await load();
  };

  return (
    <div className="grid md:grid-cols-2 gap-6">
      <div>
        <h2 className="font-semibold mb-2">Categories</h2>
        <ul className="space-y-2 text-sm max-h-80 overflow-y-auto">
          {categories.map((c) => (
            <li key={c.id} className="flex justify-between items-center border rounded px-2 py-1 bg-white">
              <span>{c.name}</span>
              <div className="flex gap-2">
                <button onClick={() => handleEdit(c)} className="text-xs text-blue-600">Edit</button>
                <button onClick={() => handleDelete(c.id)} className="text-xs text-red-600">Delete</button>
              </div>
            </li>
          ))}
        </ul>
      </div>
      <div>
        <h2 className="font-semibold mb-2">{editingId ? 'Edit Category' : 'New Category'}</h2>
        <form onSubmit={handleSubmit} className="space-y-2 text-sm">
          <input
            type="text"
            placeholder="Name"
            value={name}
            onChange={(e) => setName(e.target.value)}
            className="w-full border rounded px-2 py-1"
          />
          <textarea
            placeholder="Description"
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            className="w-full border rounded px-2 py-1"
          />
          <button type="submit" className="px-3 py-1 bg-green-600 text-white rounded">Save</button>
        </form>
      </div>
    </div>
  );
}
