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
  
  // Block admin from adding to cart
  const canAddToCart = user && !user.is_admin;

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
    <div className="max-w-6xl mx-auto">
      <div className="grid md:grid-cols-2 gap-8 bg-white rounded-lg shadow-lg p-8">
        <div className="bg-gray-50 rounded-lg p-4">
          {product.image_path && (
            <img
              src={`http://localhost:5000${product.image_path}`}
              alt={product.name}
              className="w-full h-auto max-h-96 object-cover rounded-lg shadow-md"
            />
          )}
        </div>
        <div>
          <h1 className="text-3xl font-bold mb-3 text-gray-800">{product.name}</h1>
          <div className="mb-4">
            <RatingStars rating={product.avg_rating} count={product.review_count} />
          </div>
          <p className="mt-4 text-gray-600 leading-relaxed">{product.description || 'No description available.'}</p>
          <div className="mt-6 flex items-baseline gap-3 p-4 bg-green-50 rounded-lg">
            <span className="text-3xl font-bold text-green-700">NPR {finalPrice.toFixed(2)}</span>
            {product.discount > 0 && (
              <>
                <span className="text-lg line-through text-gray-400">NPR {Number(product.price).toFixed(2)}</span>
                <span className="px-2 py-1 bg-red-500 text-white text-sm font-medium rounded">
                  {product.discount}% OFF
                </span>
              </>
            )}
          </div>
        {canAddToCart ? (
          <button
            onClick={handleAddToCart}
            className="mt-4 px-6 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors font-medium shadow-md"
          >
            Add to Cart
          </button>
        ) : user?.is_admin ? (
          <p className="mt-4 text-sm text-gray-500 italic">Admins cannot add items to cart</p>
        ) : (
          <button
            onClick={() => window.location.href = '/login'}
            className="mt-4 px-6 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors font-medium shadow-md"
          >
            Login to Add to Cart
          </button>
        )}
        </div>
      </div>

      <section className="mt-8 bg-white rounded-lg shadow-lg p-6">
        <h2 className="text-2xl font-bold mb-4 text-gray-800">Customer Reviews</h2>
        <div className="space-y-4 mb-6 max-h-96 overflow-y-auto">
          {reviews.map((r) => (
            <div key={r.id} className="border border-gray-200 rounded-lg p-4 bg-gray-50 hover:bg-gray-100 transition-colors">
              <div className="flex justify-between items-center mb-2">
                <span className="font-semibold text-gray-800">{r.username}</span>
                <span className="text-yellow-500 text-lg">{'★'.repeat(r.rating)}{'☆'.repeat(5 - r.rating)}</span>
              </div>
              {r.comment && (
                <p className="text-gray-700">{r.comment}</p>
              )}
            </div>
          ))}
          {reviews.length === 0 && (
            <p className="text-center text-gray-500 py-8">No reviews yet. Be the first to review this product!</p>
          )}
        </div>
        {user && !user.is_admin && (
          <form onSubmit={handleReviewSubmit} className="border-t pt-6 space-y-4">
            <h3 className="font-semibold text-gray-700">Write a Review</h3>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Your Rating</label>
              <select
                value={rating}
                onChange={(e) => setRating(Number(e.target.value))}
                className="border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-green-500 focus:border-transparent"
              >
                {[1, 2, 3, 4, 5].map((n) => (
                  <option key={n} value={n}>{n} Star{n > 1 ? 's' : ''}</option>
                ))}
              </select>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Your Review (Optional)</label>
              <textarea
                value={comment}
                onChange={(e) => setComment(e.target.value)}
                placeholder="Share your thoughts about this product..."
                rows="4"
                className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-green-500 focus:border-transparent"
              />
            </div>
            <button
              type="submit"
              className="px-6 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors font-medium shadow-md"
            >
              Submit Review
            </button>
          </form>
        )}
      </section>
    </div>
  );
}
