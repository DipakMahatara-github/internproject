import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import { fetchProducts } from '../services/productService.js';
import ProductCard from '../components/ProductCard.jsx';

export default function CategoryPage() {
  const { id } = useParams();
  const [products, setProducts] = useState([]);

  useEffect(() => {
    async function load() {
      const res = await fetchProducts({ categoryId: id });
      setProducts(res.data);
    }
    load();
  }, [id]);

  return (
    <div>
      <h2 className="text-lg font-semibold mb-3">Category Products</h2>
      <div className="grid grid-cols-1 sm:grid-cols-4 gap-4">
        {products.map((p) => (
          <ProductCard key={p.id} product={p} />
        ))}
      </div>
    </div>
  );
}
