import React from 'react';
import { Link } from 'react-router-dom';

export default function CategoryCard({ category }) {
  return (
    <Link
      to={`/category/${category.id}`}
      className="border rounded-lg bg-white p-4 hover:shadow-sm transition flex flex-col justify-between"
    >
      <h3 className="font-semibold text-gray-900 mb-1">{category.name}</h3>
      {category.description && (
        <p className="text-sm text-gray-500 line-clamp-2">{category.description}</p>
      )}
    </Link>
  );
}
