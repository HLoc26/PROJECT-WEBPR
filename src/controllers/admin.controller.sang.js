import articleService from "../services/article.service.js";
import categoryService from "../services/category.service.js";
import userService from "../services/user.service.js";
export default {
	async getEditors(req, res) {
		try {
			// Fetch all user IDs with the role of "editor"
			const editorIds = await UserService.findUserIdsByRole("editor");

			// Fetch each editor's details using findUserById
			const editors = await Promise.all(
				editorIds.map(async (editor) => {
					return userService.findUserById(editor.user_id, "editor");
				})
			);

			// Render the vwAdmin/editor view with the fetched data
			res.render("vwAdmin/editor", {
				editors,
			});
		} catch (error) {
			console.error("Error fetching editors:", error);
			return res.status(500).redirect("/500");
		}
	},
};
