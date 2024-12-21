import ArticleService from "../services/article.service.js";
import CategoryService from "../services/category.service.js";
const ITEMS_PER_PAGE = 10; // Số bài viết trên mỗi trang

export default {
	async GetHomepage(req, res) {
		try {
			// Get all categories first
			const categories = await CategoryService.findAllCategories();

			// Initialize object to store results
			const categoryArticles = {};

			// For each category, get top 5 newest articles
			await Promise.all(
				categories.map(async (category) => {
					const articles = await ArticleService.findArticlesByCategoryIncludingSubcategories(category.category_id);

					// Take only the first 5 articles (they're already ordered by published_date desc)
					categoryArticles[category.category_name] = articles.slice(0, 5);
				})
			);

			// Get overall newest articles across all categories
			const newestArticles = await ArticleService.findAllArticles();
			const top10Newest = newestArticles.slice(0, 10);

			// Get most viewed articles
			const mostViewedArticles = await ArticleService.findAllArticles();
			const top10MostViewed = mostViewedArticles.sort((a, b) => b.views - a.views).slice(0, 10);

			// Render the homepage with all required data
			res.render("vwHomepage/Homepage", {
				categoryArticles: categoryArticles,
				newestArticles: top10Newest,
				mostViewedArticles: top10MostViewed,
			});
		} catch (error) {
			console.error("Error in GetHomepage:", error);
			res.status(500).json({
				message: "An error occurred while fetching homepage data",
			});
		}
	},
	async getCategoryArticles(req, res) {
		try {
			const categoryId = req.query.id;
			const page = parseInt(req.query.page) || 1;

			if (!categoryId) {
				return res.redirect("/404");
			}

			const category = await CategoryService.findCategoryById(categoryId);

			if (!category) {
				return res.redirect("/404");
			}

			const result = await CategoryService.findCategoryWithArticles(categoryId, page, ITEMS_PER_PAGE);

			if (!result) {
				return res.redirect("/404");
			}

			const { articles, totalPages } = result;

			res.render("../views/vwArticle/List.ejs", {
				category,
				articles,
				currentPage: page,
				totalPages,
				categoryId,
			});
		} catch (err) {
			console.error(err);
			res.redirect("/500");
		}
	},
};
