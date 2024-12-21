import articleService from "../services/article.service.js";
import categoryService from "../services/category.service.js";
import userService from "../services/user.service.js";
export default {
	async getEditors(req, res) {
		try {
			// Fetch all users with the role of "editor"
			const editors = await userService.findUsersByRole("editor");
			// Process each editor
			const processedEditors = await Promise.all(
				editors.map(async (editor) => {
					try {
						// Fetch any additional related data if necessary, e.g., tags or statistics
						// (Example: Add more fields or transformations if needed)
						return {
							...editor,
							managedCategory: editor.managed_category_name || "Chưa có", // Default if no category
						};
					} catch (error) {
						console.error(`Error processing editor ${editor.user_id}:`, error);
						return editor; // Return editor even if additional processing fails
					}
				})
			);

			// Render the vwAdmin/editor view with the processed editors
			res.render("vwAdmin/editor", {
				editors: processedEditors,
			});
		} catch (error) {
			console.error("Error fetching editors:", error);
			return res.status(500).redirect("/500");
		}
	},
	async getEditorDetail(req, res) {},
};
