import CategoryService from "../services/category.service.js";
import apiClient from "../config/axios.js";

/**
 * Middleware to load categories directly from database
 * Recommended for better performance
 */
export async function setLocalCategories(req, res, next) {
  try {
    // Get parent categories first
    const parentCategories = await CategoryService.findAllCategories()
      .where("belong_to", null);

    // Add subcategories to each parent category
    const categoriesWithSubcategories = await Promise.all(
      parentCategories.map(async (category) => ({
        ...category,
        subcategories: await CategoryService.findSubcategories(category.category_id)
      }))
    );

    res.locals.categories = categoriesWithSubcategories;
    next();
  } catch (error) {
    console.error('Error fetching categories:', error);
    res.locals.categories = [];
    next(error);
  }
}

/**
 * Alternative middleware to load categories via API
 * Use only if direct DB access is not possible
 * @deprecated Consider using setLocalCategories for better performance
 */
export async function setApiCategories(req, res, next) {
  try {
    const response = await apiClient.get("/api/categories"); 
    res.locals.categories = response.data.data;
    next();
  } catch (error) {
    console.error('Error fetching categories via API:', error);
    res.locals.categories = [];
    next(error);
  }
}

// Default to recommended implementation
export default setLocalCategories;