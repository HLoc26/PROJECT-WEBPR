import CategoryService from "../services/category.service.js";

const ITEMS_PER_PAGE = 10; // Số bài viết trên mỗi trang

export default {
	async imgUpload(req, res) {
		// console.log("api upload: ", req.file);
		if (!req.file) {
			return res.status(400).json({ error: "No file uploaded" });
		}
		const filePath = `/img/${req.file.filename}`;
		res.status(200).json({ responseText: "Uploaded", location: filePath });
	},

	async getCategories(req, res) {
		try {
			const parentCategories = await CategoryService.findAllCategories()
				.where("belong_to", null);

			const categoriesWithSubcategories = await Promise.all(
				parentCategories.map(async (category) => ({
					...category,
					subcategories: await CategoryService.findSubcategories(category.category_id)
				}))
			);

			res.json({
				success: true,
				data: categoriesWithSubcategories
			});
		} catch (error) {
			console.error('Error in getCategories:', error);
			res.status(500).json({
				success: false,
				message: "Failed to fetch categories",
				data: [] // Ensure consistent empty response
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
