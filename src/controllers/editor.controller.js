import ArticleService from "../services/article.service.js";
import TagService from "../services/tag.service.js";
export default {
	async getEditorHome(req, res) {
		try {
			// Avoid using this, SQLi
			// const { id: categoryId } = req.query; // Retrieve category ID from query parameters

			// Using editor's information to load articles
			const categoryId = req.session.user.managed_category_id;
			const user = req.session.user.user_role;
			// Fetch articles by category (including subcategories) using ArticleService
			const articles = await ArticleService.findArticlesByCategoryIncludingSubcategories(categoryId);

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
			res.render("vwEditor/home", {
				pendingArticles,
				publishedArticles,
				articles,
				user,
				layout: "layouts/admin.main.ejs",
			});
		} catch (error) {
			console.error("Error fetching articles:", error);
			return res.status(500).redirect("/500");
		}
	},
	async getEdit(req, res) {
		try {
			const id = req.query.id; //query moi ca tay
			const article = await ArticleService.findArticleById(id);
			if (!article) {
				// Send a 404 response if the article is not found
				return res.status(404).redirect("/404");
			}

			res.render("vwEditor/edit", {
				layout: "layouts/admin.main.ejs",
				api_key: process.env.TINY_API_KEY, // Pass TinyMCE API key
				article: article, // Pass the article object to the template
			});
		} catch (error) {
			console.error("Error fetching article:", error);
			res.status(500).redirect("/error/500"); // Handle errors
			res.status(500).redirect("/500");
		}
	},
};
