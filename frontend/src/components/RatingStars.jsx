import React from 'react';

export default function RatingStars({ rating = 0, count = 0 }) {
  const full = Math.round(rating || 0);
  return (
    <div className="flex items-center gap-1 text-xs text-yellow-500">
      {Array.from({ length: 5 }).map((_, idx) => (
        <span key={idx}>{idx < full ? '★' : '☆'}</span>
      ))}
      <span className="text-gray-500 ml-1">({count})</span>
    </div>
  );
}
