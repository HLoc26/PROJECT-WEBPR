import ArticleService from "../services/article.service.js";
import CategoryService from "../services/category.service.js";
import TagService from "../services/tag.service.js";
export default {
	async getEditorHome(req, res) {
		try {
			const { id: categoryId } = req.query; // Retrieve category ID from query parameters

			// Fetch articles by category (including subcategories) using ArticleService
			const articles = await ArticleService.findArticlesWithEditor(categoryId);

			// Separate articles into pending and published based on status
			const pendingArticles = [];
			const publishedArticles = [];

			await Promise.all(
				articles.map(async (article) => {
					const tags = await TagService.findTagsByArticleId(article.article_id);
					const articleWithTags = {
						...article,
						tags: tags.map((tag) => tag.tag_name).join(", "), // Format tags as comma-separated string
					};
					if (article.status === "draft") {
						//khong add logic vi la draft
					}
					if (article.status === "need changes") {
						pendingArticles.push(articleWithTags);
					}
					if (article.status === "archived") {
						pendingArticles.push(articleWithTags);
					}
					if (article.status === "waiting") {
						publishedArticles.push(articleWithTags);
					} else if (article.status === "published") {
						publishedArticles.push(articleWithTags);
					}
				})
			);

			// Render view with the separated articles
			res.render("vwEditor/editorhome", {
				pendingArticles,
				publishedArticles,
			});
		} catch (error) {
			console.error("Error fetching articles:", error);
			return res.status(500).redirect("/500");
		}
	},
};
