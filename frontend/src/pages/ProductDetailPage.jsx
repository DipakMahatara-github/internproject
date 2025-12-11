import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import { fetchProductById } from '../services/productService.js';
import { fetchReviews, submitReview } from '../services/reviewService.js';
import { useCart } from '../context/CartContext.jsx';
import { useAuth } from '../context/AuthContext.jsx';
import RatingStars from '../components/RatingStars.jsx';

export default function ProductDetailPage() {
  const { id } = useParams();
  const [product, setProduct] = useState(null);
  const [reviews, setReviews] = useState([]);
  const [rating, setRating] = useState(5);
  const [comment, setComment] = useState('');
  const { addItem } = useCart();
  const { token, user } = useAuth();

  useEffect(() => {
    async function load() {
      const [p, r] = await Promise.all([
        fetchProductById(id),
        fetchReviews(id)
      ]);
      setProduct(p);
      setReviews(r);
    }
    load();
  }, [id]);

  const handleAddToCart = async () => {
    await addItem(product.id, 1);
  };

  const handleReviewSubmit = async (e) => {
    e.preventDefault();
    if (!token) return;
    await submitReview(token, id, rating, comment);
    const updated = await fetchReviews(id);
    setReviews(updated);
    setComment('');
  };

  if (!product) return <p>Loading...</p>;

  const finalPrice = product.price * (1 - (product.discount || 0) / 100);

  return (
    <div className="grid md:grid-cols-2 gap-8">
      <div>
        {product.image_path && (
          <img
            src={`http://localhost:5000${product.image_path}`}
            alt={product.name}
            className="w-full max-h-96 object-cover rounded"
          />
        )}
      </div>
      <div>
        <h1 className="text-2xl font-semibold mb-2">{product.name}</h1>
        <RatingStars rating={product.avg_rating} count={product.review_count} />
        <p className="mt-3 text-gray-700">{product.description}</p>
        <div className="mt-4 flex items-baseline gap-2">
          <span className="text-2xl font-semibold text-green-700">${finalPrice.toFixed(2)}</span>
          {product.discount > 0 && (
            <>
              <span className="text-sm line-through text-gray-400">${Number(product.price).toFixed(2)}</span>
              <span className="text-xs text-red-500 font-medium">-{product.discount}%</span>
            </>
          )}
        </div>
        <button
          onClick={handleAddToCart}
          className="mt-4 px-4 py-2 bg-green-600 text-white rounded text-sm"
        >
          Add to Cart
        </button>

        <section className="mt-8">
          <h2 className="text-lg font-semibold mb-2">Reviews</h2>
          <div className="space-y-3 mb-4 max-h-60 overflow-y-auto">
            {reviews.map((r) => (
              <div key={r.id} className="border rounded p-2 text-sm">
                <div className="flex justify-between mb-1">
                  <span className="font-medium">{r.username}</span>
                  <span className="text-yellow-500 text-xs">{'★'.repeat(r.rating)}</span>
                </div>
                <p className="text-gray-700 text-sm">{r.comment}</p>
              </div>
            ))}
            {reviews.length === 0 && <p className="text-sm text-gray-500">No reviews yet.</p>}
          </div>
          {user && (
            <form onSubmit={handleReviewSubmit} className="space-y-2 text-sm">
              <label className="block">
                <span className="mr-2">Your rating:</span>
                <select
                  value={rating}
                  onChange={(e) => setRating(Number(e.target.value))}
                  className="border rounded px-2 py-1 text-sm"
                >
                  {[1, 2, 3, 4, 5].map((n) => (
                    <option key={n} value={n}>{n}</option>
                  ))}
                </select>
              </label>
              <textarea
                value={comment}
                onChange={(e) => setComment(e.target.value)}
                placeholder="Write your review (optional)"
                className="w-full border rounded px-2 py-1"
              />
              <button
                type="submit"
                className="px-3 py-1 bg-green-600 text-white rounded"
              >
                Submit review
              </button>
            </form>
          )}
        </section>
      </div>
    </div>
  );
}
