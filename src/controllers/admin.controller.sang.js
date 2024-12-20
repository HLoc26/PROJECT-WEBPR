import articleService from "../services/article.service.js";
import categoryService from "../services/category.service.js";
import userService from "../services/user.service";
export default {
	async fetchEditors(req, res) {
		try {
			// Fetch all users with the role of "editor"
			const editors = await userService.findUserById(null, "editor");

			// Render the vwAdmin/editor view with the fetched editors
			res.render("vwAdmin/editor", {
				editors,
			});
		} catch (error) {
			console.error("Error fetching editors:", error);
			return res.status(500).redirect("/500");
		}
	},
};
