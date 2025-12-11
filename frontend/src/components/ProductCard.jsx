import React from 'react';
import { Link } from 'react-router-dom';
import RatingStars from './RatingStars.jsx';

export default function ProductCard({ product }) {
  const finalPrice = product.price * (1 - (product.discount || 0) / 100);
  return (
    <div className="border rounded-lg bg-white p-3 flex flex-col">
      {product.image_path && (
        <img
          src={`http://localhost:5000${product.image_path}`}
          alt={product.name}
          className="h-40 w-full object-cover rounded mb-2"
        />
      )}
      <h3 className="font-medium text-gray-900 line-clamp-2 mb-1">{product.name}</h3>
      <RatingStars rating={product.avg_rating} count={product.review_count} />
      <div className="mt-auto">
        <div className="flex items-baseline gap-2 mt-2">
          <span className="text-lg font-semibold text-green-700">${finalPrice.toFixed(2)}</span>
          {product.discount > 0 && (
            <>
              <span className="text-sm line-through text-gray-400">${Number(product.price).toFixed(2)}</span>
              <span className="text-xs text-red-500 font-medium">-{product.discount}%</span>
            </>
          )}
        </div>
        <Link
          to={`/products/${product.id}`}
          className="mt-2 inline-block text-sm text-green-700 hover:underline"
        >
          View details
        </Link>
      </div>
    </div>
  );
}
