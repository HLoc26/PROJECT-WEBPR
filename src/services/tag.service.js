import db from "../config/db.js";

export default {
	// Lấy tất cả các tags
	findAllTags() {
		return db("tags").select("tag_id", "tag_name");
	},

	// Tìm tag theo ID
	findTagById(tagId) {
		return db("tags").where("tag_id", tagId).first();
	},

	// Lấy danh sách bài viết theo tag ID + Phân trang
	findArticlesByTag(tagId, page, itemsPerPage) {
		const offset = (page - 1) * itemsPerPage;

		const articlesQuery = db("articles")
			.join("articletags", "articles.article_id", "articletags.article_id")
			.join("categories", "articles.category_id", "categories.category_id")
			.where("articletags.tag_id", tagId)
			.andWhere("articles.status", "published") // Chỉ lấy bài viết đã xuất bản
			.select("articles.article_id", "articles.title", "articles.abstract", "articles.thumbnail", "articles.published_date", "categories.category_name")
			.orderBy("articles.published_date", "desc")
			.limit(itemsPerPage)
			.offset(offset);

		const countQuery = db("articles")
			.join("articletags", "articles.article_id", "articletags.article_id")
			.where("articletags.tag_id", tagId)
			.andWhere("articles.status", "published")
			.count("articles.article_id as count");

		return Promise.all([articlesQuery, countQuery]).then(([articles, countResult]) => {
			const totalItems = countResult[0].count;
			const totalPages = Math.ceil(totalItems / itemsPerPage);

			return { articles, totalPages };
		});
	},

	// Thêm một tag mới
	addTag(tagName) {
		return db("tags").insert({ tag_name: tagName });
	},

	// Lấy tất cả các tags của một bài viết cụ thể
	findTagsByArticleId(articleId) {
		return db("tags").join("articletags", "tags.tag_id", "articletags.tag_id").where("articletags.article_id", articleId).select("tags.tag_id", "tags.tag_name");
	},

	// Thêm các tags cho một bài viết cụ thể
	addTagsToArticle(articleId, tagIds) {
		const articleTags = tagIds.map((tagId) => ({
			article_id: articleId,
			tag_id: tagId,
		}));
		return db("articletags").insert(articleTags);
	},

	// Xóa tất cả các tags của một bài viết cụ thể
	removeTagsFromArticle(articleId) {
		return db("articletags").where("article_id", articleId).del();
	},

	// Xóa một tag cụ thể
	deleteTag(tagId) {
		return db("tags").where("tag_id", tagId).del();
	},

	// Cập nhật tên của một tag cụ thể
	updateTag(tagId, tagName) {
		return db("tags").where("tag_id", tagId).update({ tag_name: tagName });
	},
};
