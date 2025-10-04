import React from 'react';
import { Link } from 'react-router-dom';
import RatingStars from './RatingStars.jsx';

export default function ProductCard({ product }) {
  const finalPrice = product.price * (1 - (product.discount || 0) / 100);
  return (
    <Link to={`/products/${product.id}`}>
      <div className="border border-gray-200 rounded-lg bg-white overflow-hidden shadow-md hover:shadow-xl transition-shadow duration-300 flex flex-col h-full group">
        <div className="relative overflow-hidden bg-gray-100">
          {product.image_path ? (
            <img
              src={`http://localhost:5000${product.image_path}`}
              alt={product.name}
              className="h-48 w-full object-cover group-hover:scale-105 transition-transform duration-300"
            />
          ) : (
            <div className="h-48 w-full bg-gray-200 flex items-center justify-center">
              <span className="text-gray-400">No Image</span>
            </div>
          )}
          {product.discount > 0 && (
            <span className="absolute top-2 right-2 bg-red-500 text-white text-xs font-bold px-2 py-1 rounded-full">
              {product.discount}% OFF
            </span>
          )}
        </div>
        <div className="p-4 flex flex-col flex-1">
          <h3 className="font-semibold text-gray-800 line-clamp-2 mb-2 min-h-[3rem] group-hover:text-green-600 transition-colors">
            {product.name}
          </h3>
          <div className="mb-3">
            <RatingStars rating={product.avg_rating} count={product.review_count} />
          </div>
          <div className="mt-auto">
            <div className="flex items-baseline gap-2">
              <span className="text-xl font-bold text-green-700">NPR {finalPrice.toFixed(2)}</span>
              {product.discount > 0 && (
                <span className="text-sm line-through text-gray-400">NPR {Number(product.price).toFixed(2)}</span>
              )}
            </div>
            <div className="mt-3 pt-3 border-t border-gray-100">
              <span className="text-sm text-green-600 font-medium group-hover:text-green-700">
                View Details →
              </span>
            </div>
          </div>
        </div>
      </div>
    </Link>
  );
}
