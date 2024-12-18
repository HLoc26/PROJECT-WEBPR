import db from "../config/db.js";

export default {
	// Lấy tất cả các articles
	findAllArticles() {
		return db("articles")
			.select(
				"articles.article_id",
				"articles.title",
				"articles.abstract",
				"articles.thumbnail",
				"articles.views",
				"articles.status",
				"articles.published_date",
				"articles.is_premium",
				"categories.category_name",
				"writers.full_name as writer_name",
				"editors.full_name as editor_name"
			)
			.leftJoin("categories", "articles.category_id", "categories.category_id")
			.leftJoin("users as writers", "articles.writer_id", "writers.user_id")
			.leftJoin("users as editors", "articles.editor_id", "editors.user_id")
			.orderBy("articles.published_date", "desc");
	},

	// Lấy các articles by category cho sections cụ thể, bao gồm subcategories
	findArticlesByCategoryIncludingSubcategories(categoryId) {
		const mainCategoryArticles = db("articles")
			.where("articles.category_id", categoryId)
			.select("article_id", "title", "abstract", "thumbnail", "views", "status", "published_date", "is_premium ");

		const subcategoryArticles = db("articles")
			.whereIn("articles.category_id", function () {
				this.select("category_id").from("categories").where("belong_to", categoryId);
			})
			.select("article_id", "title", "abstract", "thumbnail", "views", "status", "published_date", "is_premium");

		return mainCategoryArticles.union(subcategoryArticles).orderBy("published_date", "desc");
	},
	findArticlesWithEditor(categoryId) {
		// Main query with UNION wrapped in a subquery to allow ordering
		return db
			.select(
				"combined.article_id",
				"combined.title",
				"combined.abstract",
				"combined.thumbnail",
				"combined.views",
				"combined.status",
				"combined.published_date",
				"combined.is_premium",
				"combined.category_name",
				"combined.editor_name"
			)
			.from(function () {
				// Main category articles
				this.union([
					db("articles AS a")
						.leftJoin("categories AS c", "a.category_id", "c.category_id")
						.leftJoin("users AS u", "a.editor_id", "u.user_id")
						.where("c.category_id", categoryId)
						.select("a.article_id", "a.title", "a.abstract", "a.thumbnail", "a.views", "a.status", "a.published_date", "a.is_premium", "c.category_name", "u.full_name AS editor_name"),

					// Subcategory articles
					db("articles AS a")
						.leftJoin("categories AS c", "a.category_id", "c.category_id")
						.leftJoin("users AS u", "a.editor_id", "u.user_id")
						.whereIn("c.category_id", function () {
							this.select("category_id").from("categories").where("belong_to", categoryId);
						})
						.select("a.article_id", "a.title", "a.abstract", "a.thumbnail", "a.views", "a.status", "a.published_date", "a.is_premium", "c.category_name", "u.full_name AS editor_name"),
				]).as("combined"); // Combine results as a derived table
			})
			.orderBy("combined.published_date", "desc");
	},

	//Lấy articles thêm tag cho editor
	findArticlesWithTag(categoryId) {
		// Query for main category articles
		const mainCategoryArticles = db("articles")
			.where("articles.category_id", categoryId)
			.select(
				"articles.article_id",
				"articles.title",
				"articles.abstract",
				"articles.thumbnail",
				"articles.views",
				"articles.status",
				"articles.published_date",
				"articles.is_premium",
				db.raw('GROUP_CONCAT(tags.tag_name ORDER BY tags.tag_name SEPARATOR ", ") as tags')
			)
			.leftJoin("articletags", "articles.article_id", "articletags.article_id")
			.leftJoin("tags", "articletags.tag_id", "tags.tag_id")
			.groupBy("articles.article_id");

		// Query for subcategory articles (using belong_to relationship)
		const subcategoryArticles = db("articles")
			.whereIn("articles.category_id", function () {
				// Fetch category ids where belong_to matches the given categoryId
				this.select("category_id").from("categories").where("belong_to", categoryId);
			})
			.select(
				"articles.article_id",
				"articles.title",
				"articles.abstract",
				"articles.thumbnail",
				"articles.views",
				"articles.status",
				"articles.published_date",
				"articles.is_premium",
				db.raw('GROUP_CONCAT(tags.tag_name ORDER BY tags.tag_name SEPARATOR ", ") as tags')
			)
			.leftJoin("articletags", "articles.article_id", "articletags.article_id")
			.leftJoin("tags", "articletags.tag_id", "tags.tag_id")
			.groupBy("articles.article_id");

		// Combine the results using UNION and sort by published date
		return mainCategoryArticles.union(subcategoryArticles).orderBy("articles.published_date", "desc");
	},

	// Lấy một article cụ thể by ID
	findArticleById(id) {
		return db("articles")
			.where("articles.article_id", id)
			.first()
			.leftJoin("categories", "articles.category_id", "categories.category_id")
			.leftJoin("users as writers", "articles.writer_id", "writers.user_id")
			.leftJoin("users as editors", "articles.editor_id", "editors.user_id")
			.select("articles.*", "categories.category_name", "writers.full_name as writer_name", "editors.full_name as editor_name");
	},

	findByWriterId(writer_id) {
		return db("articles")
			.where("writers.user_id", writer_id)
			.leftJoin("categories", "articles.category_id", "categories.category_id")
			.leftJoin("users as writers", "articles.writer_id", "writers.user_id")
			.leftJoin("users as editors", "articles.editor_id", "editors.user_id")
			.select("articles.*", "categories.category_name", "writers.full_name as writer_name", "editors.full_name as editor_name");
	},

	// Thêm article (entity: { title, content, abstract, thumbnail, category_id, writer_id, editor_id, status, is_premium, published_date })
	addArticle(entity) {
		return db("articles").insert(entity);
	},

	// Xóa article by ID
	deleteArticle(id) {
		return db("articles").where("article_id", id).del();
	},

	// Cập nhật article (patch method) theo ID
	updateArticle(id, entity) {
		return db("articles").where("article_id", id).update(entity);
	},

	// Cập nhật article status (e.g., to "published", "archived", etc.)
	updateArticleStatus(id, status) {
		return db("articles").where("article_id", id).update({ status });
	},

	// // Tăng 1 view khi thực hiện truy vấn, cần xem lại vì user có thể hack view, nên xử lý trong backend.
	// incrementArticleViews(id) {
	//   return db('articles').where('article_id', id).increment('views', 1);
	// }

	findCommentsById(articleId) {
		return db("comments")
			.where("comments.article_id", articleId)
			.leftJoin("users", "comments.user_id", "users.user_id")
			.select("comments.comment_id", "comments.content", "comments.created_at", "comments.updated_at", "users.full_name as commenter_name")
			.orderBy("comments.created_at", "asc");
	},

	getPendingArticles(editorId) {
		return db("articles")
			.leftJoin("categories", "articles.category_id", "categories.category_id")
			.leftJoin("users", "articles.editor_id", "users.user_id")
			.where("articles.status", "waiting")
			.andWhere("users.user_id", editorId)
			.andWhere(function () {
				this.where("articles.category_id", function () {
					this.select("managed_category_id").from("users").where("user_id", editorId);
				}).orWhere("categories.belong_to", function () {
					this.select("managed_category_id").from("users").where("user_id", editorId);
				});
			})
			.select("articles.article_id", "articles.title", "articles.abstract", "articles.thumbnail", "articles.views", "articles.status", "articles.published_date", "articles.is_premium")
			.orderBy("articles.published_date", "desc");
	},

	updateArticleStatus(articleId, status, noteContent, editorId) {
		return db.transaction(async (trx) => {
			// Lấy thông tin bài viết và chuyên mục do editor quản lý
			const article = await trx("articles")
				.where("articles.article_id", articleId)
				.leftJoin("categories", "articles.category_id", "categories.category_id") // Join với cate
				.select("articles.category_id", "categories.belong_to")
				.first();

			// lấy thông tin editor
			const editor = await trx("users")
				.where("users.user_id", editorId)
				.select("managed_category_id") // Lấy chuyên mục chính mà editor quản lý
				.first();

			// Kiểm tra quyền
			if (
				article.category_id !== editor.managed_category_id && // Không thuộc cat chính
				article.belong_to !== editor.managed_category_id // Không thuộc cat phụ
			) {
				throw new Error("Editor is not authorized to approve this article");
			}

			// Update trạng thái article
			await trx("articles").where("article_id", articleId).update({ status });

			// Ghi lại lịch sử phê duyệt
			await trx("approvalhistories").insert({
				article_id: articleId,
				editor_id: editorId,
				note_content: noteContent,
			});
		});
	},
};
