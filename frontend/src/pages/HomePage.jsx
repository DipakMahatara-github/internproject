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
    <div className="space-y-8">
      <section>
        <h2 className="text-lg font-semibold mb-3">Shop by Category</h2>
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          {categories.map((c) => (
            <CategoryCard key={c.id} category={c} />
          ))}
        </div>
      </section>
      <section>
        <h2 className="text-lg font-semibold mb-3">Featured Products</h2>
        <div className="grid grid-cols-1 sm:grid-cols-4 gap-4">
          {products.map((p) => (
            <ProductCard key={p.id} product={p} />
          ))}
        </div>
      </section>
    </div>
  );
}
