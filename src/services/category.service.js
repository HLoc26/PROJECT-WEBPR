import { db } from "";

export default {
    // Fetch all categories
    findAllCategories() {
      return db('categories');
    },
  
    // Fetch a specific category by ID
    findCategoryById(id) {
      return db('categories').where('category_id', id).first();
    },

    // Fetch all subcategories of a particular category
    findSubcategories(parentCategoryId) {
        return db('categories').where('belong_to', parentCategoryId);
    },
};
  