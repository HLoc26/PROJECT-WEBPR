import db from '../config/db.js'
import knex from '../config/db.js';

const Article = db.Article;


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

    async findCategoryWithArticles(categoryId, page, limit) {
    const offset = (page - 1) * limit;

    const articles = await knex('articles')
        .where('category_id', categoryId)
        .limit(limit)
        .offset(offset);

    const totalArticles = await knex('articles')
        .where('category_id', categoryId)
        .count('article_id as count');
    

    const totalPages = Math.ceil(totalArticles[0].count / limit);

    return { articles, totalPages };
}
};
  