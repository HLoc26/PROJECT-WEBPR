import CategoryService from "../services/category.service.js";
import tagService from "../services/tag.service.js";
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
			const parentCategories = await CategoryService.findAllCategories().where("belong_to", null);

			const categoriesWithSubcategories = await Promise.all(
				parentCategories.map(async (category) => ({
					...category,
					subcategories: await CategoryService.findSubcategories(category.category_id),
				}))
			);

			res.json({
				success: true,
				data: categoriesWithSubcategories,
			});
		} catch (error) {
			console.error("Error in getCategories:", error);
			res.status(500).json({
				success: false,
				message: "Failed to fetch categories",
				data: [], // Ensure consistent empty response
			});
		}
	},
	async getTags(req, res) {
		try {
			const tags = await tagService.findAllTags();

			res.json({
				success: true,
				data: tags,
			});
		} catch (error) {
			console.error("Error in getTags:", error);
			res.status(500).json({
				success: false,
				message: "Failed to fetch tags",
				data: [], // Ensure consistent empty response
			});
		}
	},
};
