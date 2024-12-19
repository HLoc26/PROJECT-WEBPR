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

			// Use Promise.all with map instead of forEach
			await Promise.all(
				articles.map(async (article) => {
					const tags = await TagService.findTagsByArticleId(article.article_id);
					const articleWithTags = {
						...article,
						tags: tags.map((tag) => tag.tag_name).join(", "), // Format tags as comma-separated string
					};

					switch (article.status) {
						case "draft":
							// Skip drafts
							break;
						case "need changes":
						case "archived":
						case "waiting":
							pendingArticles.push(articleWithTags); // Waiting articles should be pending
							break;
						case "published":
							publishedArticles.push(articleWithTags);
							break;
						default:
							console.warn(`Unknown article status: ${article.status}`);
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
