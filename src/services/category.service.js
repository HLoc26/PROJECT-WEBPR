import db from "../config/db.js";
import knex from "../config/db.js";

const Article = db.Article;

export default {
	// Fetch all categories
	findAllCategories() {
		return db("categories");
	},

	// Fetch a specific category by ID
	findCategoryById(id) {
		return db("categories").where("category_id", id).first();
	},

	// Fetch all subcategories of a particular category
	findSubcategories(parentCategoryId) {
		return db("categories").where("belong_to", parentCategoryId);
	},

	async findCategoryWithArticles(categoryId, page, limit) {
		const offset = (page - 1) * limit;

		const articles = await knex("articles").where("category_id", categoryId).limit(limit).offset(offset);

		const totalArticles = await knex("articles").where("category_id", categoryId).count("article_id as count");

		const totalPages = Math.ceil(totalArticles[0].count / limit);

		return { articles, totalPages };
	},

	findEditorCategory(editor_id) {
		return db("categories").join("users", "users.managed_category_id", "categories.category_id").where("users.user_id", editor_id).select("categories.*");
	},

	getTop10Views() {
		return db("categories as c")
			.leftJoin("articles as a", "c.category_id", "a.category_id")
			.select("c.category_id")
			.sum("a.views as total_views")
			.groupBy("c.category_id")
			.orderBy("total_views", "desc")
			.limit(10);
	},
};