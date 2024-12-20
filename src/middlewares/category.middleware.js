import CategoryService from "../services/category.service.js";

export default async function setCategories(req, res, next) {
  try {
    const categories = await CategoryService.findAllCategories();
    console.log('Categories loaded:', categories);
    res.locals.categories = categories || [];
    next();
  } catch (error) {
    console.error('Error fetching categories:', error);
    res.locals.categories = []; // Set empty array as fallback
    next(error);
  }
}
