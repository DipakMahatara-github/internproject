import React, { useEffect, useState } from 'react';
import { fetchCategories, fetchProducts } from '../services/productService.js';
import ProductCard from '../components/ProductCard.jsx';
import Pagination from '../components/Pagination.jsx';

export default function ProductListPage() {
  const [categories, setCategories] = useState([]);
  const [products, setProducts] = useState([]);
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [filters, setFilters] = useState({ search: '', categoryId: '', sort: '' });

  useEffect(() => {
    fetchCategories().then(setCategories);
  }, []);

  useEffect(() => {
    async function load() {
      const res = await fetchProducts({
        page,
        search: filters.search || undefined,
        categoryId: filters.categoryId || undefined,
        sort: filters.sort || undefined
      });
      setProducts(res.data);
      setTotalPages(res.pagination.totalPages || 1);
    }
    load();
  }, [page, filters]);

  const handleFilterChange = (e) => {
    setPage(1);
    setFilters((prev) => ({ ...prev, [e.target.name]: e.target.value }));
  };

  return (
    <div className="space-y-4">
      <div className="flex flex-wrap gap-3 items-center mb-2">
        <input
          type="text"
          name="search"
          placeholder="Search products..."
          value={filters.search}
          onChange={handleFilterChange}
          className="border px-3 py-1 rounded text-sm"
        />
        <select
          name="categoryId"
          value={filters.categoryId}
          onChange={handleFilterChange}
          className="border px-2 py-1 rounded text-sm"
        >
          <option value="">All categories</option>
          {categories.map((c) => (
            <option key={c.id} value={c.id}>{c.name}</option>
          ))}
        </select>
        <select
          name="sort"
          value={filters.sort}
          onChange={handleFilterChange}
          className="border px-2 py-1 rounded text-sm"
        >
          <option value="">Sort by</option>
          <option value="price_asc">Price: Low to High</option>
          <option value="price_desc">Price: High to Low</option>
          <option value="newest">Newest</option>
        </select>
      </div>
      <div className="grid grid-cols-1 sm:grid-cols-4 gap-4">
        {products.map((p) => (
          <ProductCard key={p.id} product={p} />
        ))}
      </div>
      <Pagination page={page} totalPages={totalPages} onChange={setPage} />
    </div>
  );
}
