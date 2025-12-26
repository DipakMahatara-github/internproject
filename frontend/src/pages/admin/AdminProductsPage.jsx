import React, { useEffect, useState } from 'react';
import { useAuth } from '../../context/AuthContext.jsx';
import api, { withAuth } from '../../services/api.js';
import { fetchCategories, fetchProducts } from '../../services/productService.js';

export default function AdminProductsPage() {
  const { token } = useAuth();
  const [products, setProducts] = useState([]);
  const [categories, setCategories] = useState([]);
  const [form, setForm] = useState({ id: null, name: '', category_id: '', price: '', discount: '', description: '', image: null });
  const [imagePreview, setImagePreview] = useState(null);

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
      const file = files[0];
      setForm((f) => ({ ...f, image: file }));
      // Create preview
      const reader = new FileReader();
      reader.onloadend = () => {
        setImagePreview(reader.result);
      };
      reader.readAsDataURL(file);
    } else {
      setForm((f) => ({ ...f, [name]: value }));
    }
  };

  const resetForm = () => {
    setForm({ id: null, name: '', category_id: '', price: '', discount: '', description: '', image: null });
    setImagePreview(null);
  };

  const handleEdit = (p) => {
    setForm({ id: p.id, name: p.name, category_id: p.category_id, price: p.price, discount: p.discount, description: p.description, image: null });
    setImagePreview(p.image_path ? `http://localhost:5000${p.image_path}` : null);
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
    <div className="max-w-7xl mx-auto">
      <h1 className="text-2xl font-bold text-gray-800 mb-6">Product Management</h1>
      <div className="grid md:grid-cols-2 gap-8">
        <div className="bg-white rounded-lg shadow-md p-6">
          <h2 className="text-lg font-semibold mb-4 text-gray-700">Products List</h2>
          <ul className="space-y-3 max-h-96 overflow-y-auto">
            {products.map((p) => (
              <li key={p.id} className="flex justify-between items-center border border-gray-200 rounded-lg px-4 py-3 bg-gray-50 hover:bg-gray-100 transition-colors">
                <div className="flex-1">
                  <span className="font-medium text-gray-800">{p.name}</span>
                  <p className="text-xs text-gray-500 mt-1">NPR {Number(p.price).toFixed(2)}</p>
                </div>
                <div className="flex gap-2">
                  <button 
                    onClick={() => handleEdit(p)} 
                    className="px-3 py-1 text-xs bg-blue-500 text-white rounded hover:bg-blue-600 transition-colors"
                  >
                    Edit
                  </button>
                  <button 
                    onClick={() => handleDelete(p.id)} 
                    className="px-3 py-1 text-xs bg-red-500 text-white rounded hover:bg-red-600 transition-colors"
                  >
                    Delete
                  </button>
                </div>
              </li>
            ))}
            {products.length === 0 && (
              <li className="text-center text-gray-500 py-8">No products found</li>
            )}
          </ul>
        </div>
        <div className="bg-white rounded-lg shadow-md p-6">
          <h2 className="text-lg font-semibold mb-4 text-gray-700">
            {form.id ? 'Edit Product' : 'Create New Product'}
          </h2>
          <form onSubmit={handleSubmit} className="space-y-4" encType="multipart/form-data">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Product Name</label>
              <input
                type="text"
                name="name"
                placeholder="Enter product name"
                value={form.name}
                onChange={handleChange}
                className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-green-500 focus:border-transparent"
                required
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Category</label>
              <select
                name="category_id"
                value={form.category_id}
                onChange={handleChange}
                className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-green-500 focus:border-transparent"
                required
              >
                <option value="">Select category</option>
                {categories.map((c) => (
                  <option key={c.id} value={c.id}>{c.name}</option>
                ))}
              </select>
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Price</label>
                <input
                  type="number"
                  name="price"
                  placeholder="0.00"
                  step="0.01"
                  min="0"
                  value={form.price}
                  onChange={handleChange}
                  className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-green-500 focus:border-transparent"
                  required
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Discount (%)</label>
                <input
                  type="number"
                  name="discount"
                  placeholder="0"
                  min="0"
                  max="100"
                  value={form.discount}
                  onChange={handleChange}
                  className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-green-500 focus:border-transparent"
                />
              </div>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Description</label>
              <textarea
                name="description"
                placeholder="Enter product description"
                value={form.description}
                onChange={handleChange}
                rows="4"
                className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-green-500 focus:border-transparent"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Product Image</label>
              <input 
                type="file" 
                name="image" 
                accept="image/*" 
                onChange={handleChange}
                className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-green-500 focus:border-transparent"
              />
              {imagePreview && (
                <div className="mt-3">
                  <p className="text-sm text-gray-600 mb-2">Preview:</p>
                  <img 
                    src={imagePreview} 
                    alt="Preview" 
                    className="max-w-full h-48 object-cover rounded-lg border border-gray-300"
                  />
                </div>
              )}
            </div>
            <div className="flex gap-3">
              <button 
                type="submit" 
                className="flex-1 px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors font-medium shadow-md"
              >
                {form.id ? 'Update Product' : 'Create Product'}
              </button>
              {form.id && (
                <button 
                  type="button"
                  onClick={resetForm}
                  className="px-4 py-2 bg-gray-500 text-white rounded-lg hover:bg-gray-600 transition-colors font-medium"
                >
                  Cancel
                </button>
              )}
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}
