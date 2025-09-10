import { getReviewsByProduct, upsertReview } from '../models/review.model.js';

export async function listProductReviews(req, res, next) {
  try {
    const { productId } = req.params;
    const reviews = await getReviewsByProduct(productId);
    res.json(reviews);
  } catch (err) {
    next(err);
  }
}

export async function createOrUpdateReview(req, res, next) {
  try {
    const { productId } = req.params;
    const { rating, comment } = req.body;
    if (!rating) {
      return res.status(400).json({ message: 'Rating is required' });
    }
    const id = await upsertReview({
      userId: req.user.id,
      productId,
      rating,
      comment
    });
    res.status(201).json({ id, message: 'Review saved' });
  } catch (err) {
    next(err);
  }
}
