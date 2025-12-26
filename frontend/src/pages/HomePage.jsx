import React, { useEffect, useState } from 'react';
import { fetchCategories, fetchProducts } from '../services/productService.js';
import CategoryCard from '../components/CategoryCard.jsx';
import ProductCard from '../components/ProductCard.jsx';

export default function HomePage() {
  const [categories, setCategories] = useState([]);
  const [products, setProducts] = useState([]);

  useEffect(() => {
    async function load() {
      const [cats, prodsResp] = await Promise.all([
        fetchCategories(),
        fetchProducts({ limit: 8, sort: 'newest' })
      ]);
      setCategories(cats);
      setProducts(prodsResp.data);
    }
    load();
  }, []);

  return (
    <div className="space-y-12">
      {/* Hero Section */}
      <section className="bg-gradient-to-r from-green-600 to-green-700 rounded-lg shadow-lg p-8 text-white text-center">
        <h1 className="text-4xl font-bold mb-4">Welcome to Sworaj Krishi Farm</h1>
        <p className="text-xl text-green-100">Fresh, organic products delivered to your doorstep</p>
      </section>

      {/* Categories Section */}
      <section>
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-2xl font-bold text-gray-800">Shop by Category</h2>
          <a href="/products" className="text-green-600 hover:text-green-700 font-medium">
            View All →
          </a>
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {categories.map((c) => (
            <CategoryCard key={c.id} category={c} />
          ))}
        </div>
      </section>

      {/* Featured Products Section */}
      <section>
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-2xl font-bold text-gray-800">Featured Products</h2>
          <a href="/products" className="text-green-600 hover:text-green-700 font-medium">
            View All →
          </a>
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {products.map((p) => (
            <ProductCard key={p.id} product={p} />
          ))}
        </div>
      </section>
    </div>
  );
}
