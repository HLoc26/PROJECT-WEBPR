import ArticleService from "../services/article.service.js";
import CategoryService from "../services/category.service.js";
export default {
	async getEditorHome(req, res) {
		try {
			const { id: categoryId } = req.query; // Retrieve category ID from query parameters

			// Fetch articles by category (including subcategories) using ArticleService
			const articles = await ArticleService.findArticlesWithTag(categoryId);

			// Check if articles exist
			if (!articles || articles.length === 0) {
				// Redirect to 404 if no articles are found
				return res.status(404).redirect("/404");
			}

			// Render view with the articles
			res.render("vwEditor/editorhome", {
				articles: articles, // Pass the articles data to the view
			});
		} catch (error) {
			console.error("Error fetching articles:", error);
			return res.status(500).redirect("/500");
		}
	},
};
