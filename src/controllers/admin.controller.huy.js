import articleService from "../services/article.service.js";
import categoryService from "../services/category.service.js";
import userService from "../services/user.service.js";
import tagService from "../services/tag.service.js";
export default {
	async getCategories(req, res) {
        try {
            

			
			// Render the vwAdmin/editor view with the processed editors
			res.render("vwAdmin/category", {
				categories: resutls,
			});
		} catch (error) {
			console.error("Error fetching editors:", error);
			return res.status(500).redirect("/500");
		}
	},
};
