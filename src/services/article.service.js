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
		return db("articles")
			.select("articles.*", "categories.*", "users.user_id as editor_id", "users.username as editor_username", "users.full_name as editor_fullname")
			.leftJoin("users", "articles.editor_id", "users.user_id")
			.where(function () {
				this.where("articles.category_id", categoryId).orWhereIn("articles.category_id", function () {
					this.select("category_id").from("categories").where("belong_to", categoryId);
				});
			})
			.join("categories", "articles.category_id", "categories.category_id")
			.orderBy("published_date", "desc");
	},

	//Lấy articles thêm tag cho editor
	// findArticlesWithTag(categoryId) {
	//   const mainCategoryArticles = db('articles')
	//     .where('articles.category_id', categoryId)
	//     .select(
	//       'articles.article_id',
	//       'articles.title',
	//       'articles.abstract',
	//       'articles.thumbnail',
	//       'articles.views',
	//       'articles.status',
	//       'articles.published_date',
	//       'articles.is_premium',
	//       db.raw('GROUP_CONCAT(tags.tag_name ORDER BY tags.tag_name SEPARATOR ", ") as tags')
	//     )
	//     .leftJoin('articletags', 'articles.article_id', 'articletags.article_id')
	//     .leftJoin('tags', 'articletags.tag_id', 'tags.tag_id')
	//     .groupBy('articles.article_id');

	//   const subcategoryArticles = db('articles')
	//     .whereIn('articles.category_id', function () {
	//       this.select('category_id')
	//         .from('categories')
	//         .where('belong_to', categoryId);
	//     })
	//     .select(
	//       'articles.article_id',
	//       'articles.title',
	//       'articles.abstract',
	//       'articles.thumbnail',
	//       'articles.views',
	//       'articles.status',
	//       'articles.published_date',
	//       'articles.is_premium',
	//       db.raw('GROUP_CONCAT(tags.tag_name ORDER BY tags.tag_name SEPARATOR ", ") as tags')
	//     )
	//     .leftJoin('articletags', 'articles.article_id', 'articletags.article_id')
	//     .leftJoin('tags', 'articletags.tag_id', 'tags.tag_id')
	//     .groupBy('articles.article_id');

	//   return mainCategoryArticles.union(subcategoryArticles).orderBy('articles.published_date', 'desc');
	// },

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
			.select(
				"articles.article_id",
				"articles.title",
				"articles.abstract",
				"articles.thumbnail",
				"articles.views",
				"articles.status",
				"articles.published_date",
				"articles.is_premium",
				"articles.category_id",
				"categories.belong_to"
			)
			.orderBy("articles.published_date", "desc");
	},

	approveArticle(articleId, status, noteContent, editorId) {
		return db.transaction(async (trx) => {
			// Cập nhật lại status và insert approval history
			await trx("articles").where("article_id", articleId).update({ status });

			await trx("approvalhistories").insert({
				article_id: articleId,
				editor_id: editorId,
				note_content: noteContent,
			});
		});
	},
	async findRelatedArticles(articleId, categoryId, limit = 5) {
		// First get all tags for the current article
		const articleTags = await db("articletags").where("article_id", articleId).pluck("tag_id");

		// Get articles from same category and articles with same tags
		const relatedByCategoryAndTags = await db("articles")
			.distinct(
				"articles.article_id",
				"articles.title",
				"articles.abstract",
				"articles.thumbnail",
				"articles.views",
				"articles.published_date",
				"articles.is_premium",
				"articles.category_id",
				"categories.category_name",
				"writers.full_name as writer_name"
			)
			.where("articles.status", "published")
			.whereNot("articles.article_id", articleId)
			.where(function () {
				// Articles from same category
				this.where("articles.category_id", categoryId)
					// OR articles with same tags
					.orWhereExists(function () {
						this.select("*").from("articletags").whereRaw("articletags.article_id = articles.article_id").whereIn("articletags.tag_id", articleTags);
					});
			})
			.leftJoin("categories", "articles.category_id", "categories.category_id")
			.leftJoin("users as writers", "articles.writer_id", "writers.user_id")
			// Prioritize articles that match both category and tags
			.orderByRaw(
				`
            CASE 
                WHEN articles.category_id = ? AND EXISTS (
                    SELECT 1 FROM articletags 
                    WHERE articletags.article_id = articles.article_id 
                    AND articletags.tag_id IN (${articleTags.join(",")})
                ) THEN 1
                WHEN articles.category_id = ? THEN 2
                ELSE 3
            END
        `,
				[categoryId, categoryId]
			)
			.orderBy("articles.published_date", "desc")
			.limit(limit);

		/// Articles matching both category and tags appear first
		/// Articles matching only category appear second
		/// Articles matching only tags appear last
		/// Within each group, newer articles appear first

		return relatedByCategoryAndTags;
	},
};
