import { getAllCategories, createCategory, updateCategory, deleteCategory } from '../models/category.model.js';

export async function listCategories(req, res, next) {
  try {
    const categories = await getAllCategories();
    res.json(categories);
  } catch (err) {
    next(err);
  }
}

export async function createCategoryHandler(req, res, next) {
  try {
    const { name, description } = req.body;
    if (!name) {
      return res.status(400).json({ message: 'Name is required' });
    }
    const category = await createCategory({ name, description });
    res.status(201).json(category);
  } catch (err) {
    next(err);
  }
}

export async function updateCategoryHandler(req, res, next) {
  try {
    const { id } = req.params;
    const { name, description } = req.body;
    if (!name) {
      return res.status(400).json({ message: 'Name is required' });
    }
    await updateCategory(id, { name, description });
    res.json({ message: 'Category updated' });
  } catch (err) {
    next(err);
  }
}

export async function deleteCategoryHandler(req, res, next) {
  try {
    const { id } = req.params;
    await deleteCategory(id);
    res.json({ message: 'Category deleted' });
  } catch (err) {
    next(err);
  }
}
