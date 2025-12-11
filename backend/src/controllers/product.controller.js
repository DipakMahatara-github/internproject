import { getPaginationParams } from '../utils/pagination.js';
import { getProducts, getProductById, createProduct, updateProduct, deleteProduct } from '../models/product.model.js';

export async function listProducts(req, res, next) {
  try {
    const { page, limit, offset } = getPaginationParams(req.query);
    const { categoryId, search, sort } = req.query;
    const { items, total } = await getProducts({ offset, limit, categoryId, search, sort });
    res.json({
      data: items,
      pagination: {
        page,
        limit,
        total,
        totalPages: Math.ceil(total / limit)
      }
    });
  } catch (err) {
    next(err);
  }
}

export async function getProduct(req, res, next) {
  try {
    const { id } = req.params;
    const product = await getProductById(id);
    if (!product) {
      return res.status(404).json({ message: 'Product not found' });
    }
    res.json(product);
  } catch (err) {
    next(err);
  }
}

export async function createProductHandler(req, res, next) {
  try {
    const { category_id, name, description, price, discount } = req.body;
    if (!category_id || !name || !price) {
      return res.status(400).json({ message: 'category_id, name, price are required' });
    }
    const image_path = req.file ? `/uploads/products/${req.file.filename}` : null;
    const result = await createProduct({
      category_id,
      name,
      description,
      price,
      discount: discount || 0,
      image_path
    });
    res.status(201).json({ id: result.id, message: 'Product created' });
  } catch (err) {
    next(err);
  }
}

export async function updateProductHandler(req, res, next) {
  try {
    const { id } = req.params;
    const { category_id, name, description, price, discount } = req.body;
    if (!category_id || !name || !price) {
      return res.status(400).json({ message: 'category_id, name, price are required' });
    }
    const image_path = req.file ? `/uploads/products/${req.file.filename}` : null;
    await updateProduct(id, {
      category_id,
      name,
      description,
      price,
      discount: discount || 0,
      image_path
    });
    res.json({ message: 'Product updated' });
  } catch (err) {
    next(err);
  }
}

export async function deleteProductHandler(req, res, next) {
  try {
    const { id } = req.params;
    await deleteProduct(id);
    res.json({ message: 'Product deleted' });
  } catch (err) {
    next(err);
  }
}
