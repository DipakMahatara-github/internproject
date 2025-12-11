import React, { useEffect, useState } from 'react';
import { useAuth } from '../../context/AuthContext.jsx';
import api, { withAuth } from '../../services/api.js';
import { fetchCategories, fetchProducts } from '../../services/productService.js';

export default function AdminProductsPage() {
  const { token } = useAuth();
  const [products, setProducts] = useState([]);
  const [categories, setCategories] = useState([]);
  const [form, setForm] = useState({ id: null, name: '', category_id: '', price: '', discount: '', description: '', image: null });

  useEffect(() => {
    async function load() {
      const [cats, prods] = await Promise.all([
        fetchCategories(),
        fetchProducts({ limit: 100 })
      ]);
      setCategories(cats);
      setProducts(prods.data);
    }
    load();
  }, []);

  const handleChange = (e) => {
    const { name, value, files } = e.target;
    if (files) {
      setForm((f) => ({ ...f, image: files[0] }));
    } else {
      setForm((f) => ({ ...f, [name]: value }));
    }
  };

  const resetForm = () => setForm({ id: null, name: '', category_id: '', price: '', discount: '', description: '', image: null });

  const handleEdit = (p) => {
    setForm({ id: p.id, name: p.name, category_id: p.category_id, price: p.price, discount: p.discount, description: p.description, image: null });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const client = withAuth(token);
    const data = new FormData();
    data.append('name', form.name);
    data.append('category_id', form.category_id);
    data.append('price', form.price);
    data.append('discount', form.discount || 0);
    data.append('description', form.description);
    if (form.image) data.append('image', form.image);

    if (form.id) {
      await client.put(`/products/${form.id}`, data);
    } else {
      await client.post('/products', data);
    }
    const prods = await fetchProducts({ limit: 100 });
    setProducts(prods.data);
    resetForm();
  };

  const handleDelete = async (id) => {
    const client = withAuth(token);
    await client.delete(`/products/${id}`);
    const prods = await fetchProducts({ limit: 100 });
    setProducts(prods.data);
  };

  return (
    <div className="grid md:grid-cols-2 gap-6">
      <div>
        <h2 className="font-semibold mb-2">Products</h2>
        <ul className="space-y-2 text-sm max-h-80 overflow-y-auto">
          {products.map((p) => (
            <li key={p.id} className="flex justify-between items-center border rounded px-2 py-1 bg-white">
              <span>{p.name}</span>
              <div className="flex gap-2">
                <button onClick={() => handleEdit(p)} className="text-xs text-blue-600">Edit</button>
                <button onClick={() => handleDelete(p.id)} className="text-xs text-red-600">Delete</button>
              </div>
            </li>
          ))}
        </ul>
      </div>
      <div>
        <h2 className="font-semibold mb-2">{form.id ? 'Edit Product' : 'New Product'}</h2>
        <form onSubmit={handleSubmit} className="space-y-2 text-sm" encType="multipart/form-data">
          <input
            type="text"
            name="name"
            placeholder="Name"
            value={form.name}
            onChange={handleChange}
            className="w-full border rounded px-2 py-1"
          />
          <select
            name="category_id"
            value={form.category_id}
            onChange={handleChange}
            className="w-full border rounded px-2 py-1"
          >
            <option value="">Select category</option>
            {categories.map((c) => (
              <option key={c.id} value={c.id}>{c.name}</option>
            ))}
          </select>
          <input
            type="number"
            name="price"
            placeholder="Price"
            value={form.price}
            onChange={handleChange}
            className="w-full border rounded px-2 py-1"
          />
          <input
            type="number"
            name="discount"
            placeholder="Discount %"
            value={form.discount}
            onChange={handleChange}
            className="w-full border rounded px-2 py-1"
          />
          <textarea
            name="description"
            placeholder="Description"
            value={form.description}
            onChange={handleChange}
            className="w-full border rounded px-2 py-1"
          />
          <input type="file" name="image" accept="image/*" onChange={handleChange} />
          <button type="submit" className="px-3 py-1 bg-green-600 text-white rounded">
            Save
          </button>
        </form>
      </div>
    </div>
  );
}
