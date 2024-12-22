import articleService from "../services/article.service.js";
import categoryService from "../services/category.service.js";
import userService from "../services/user.service.js";
import tagService from "../services/tag.service.js";
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
	async getEditorDetails(req, res) {
		try {
			const editorId = req.params.id || req.query.id;

			if (!editorId) {
				return res.status(400).send("Editor ID is required.");
			}

			// Fetch the editor details
			const editors = await userService.findUsersByRole("editor");
			const editorDetails = editors.find((e) => e.user_id === parseInt(editorId, 10));

			if (!editorDetails) {
				return res.status(404).send("Editor not found.");
			}

			// Fetch categories and organize them with subcategories
			const categories = await categoryService.findAllCategories();
			const organizedCategories = categories
				.filter((category) => category.belong_to === null)
				.map((category) => ({
					...category,
					subcategories: categories.filter((subcat) => subcat.belong_to === category.category_id),
				}));

			// Fetch articles managed by the editor's category
			const articles = await articleService.findArticlesByCategoryIncludingSubcategories(editorDetails.managed_category_id);

			// Fetch tags for each article
			const articleTagsMap = {};
			await Promise.all(
				articles.map(async (article) => {
					const articleTags = await tagService.findTagsByArticleId(article.article_id);
					articleTagsMap[article.article_id] = articleTags || [];
				})
			);

			// Fetch roles excluding admin
			const roles = await userService.findAllRoles();
			const filteredRoles = roles.filter((role) => role.user_role !== "admin");

			// Render the view with organized data
			res.render("vwAdmin/editor_detail", {
				editor: {
					...editorDetails,
					managedCategory: editorDetails.managed_category_name || "Chưa có",
				},
				articles: articles || [],
				categories: organizedCategories,
				roles: filteredRoles,
				tags: articleTagsMap, // Pass tags as a map keyed by article_id
			});
		} catch (error) {
			console.error("Error fetching editor details:", error);
			return res.status(500).redirect("/500");
		}
	},
	async deleteUser(req, res) {
		const { user_id } = req.params;

		try {
			await userService.deleteUser(user_id);
			res.redirect("/admin/editor?message=User deleted successfully");
		} catch (error) {
			console.error("Error deleting user:", error);
			res.status(500).send("Error deleting user");
		}
	},
	async updateProfile(req, res) {
		try {
			const { user_id } = req.params;
			const { role, category } = req.body; // Extract selected role and category from the form submission

			if (!user_id || !role || !category) {
				return res.status(400).send("User ID, role, and category are required.");
			}

			// Construct the entity to update
			const entity = {
				user_role: role, // Map the selected role to the user_role field
				managed_category_id: parseInt(category, 10), // Ensure the category is stored as an integer
			};

			// Call the service to update the user's profile
			await userService.adminUpdateProfile(user_id, entity);

			// Redirect back to the editor detail page with a success message
			res.redirect(`/admin/editor`);
		} catch (error) {
			console.error("Error updating user profile:", error);
			res.status(500).redirect("/500");
		}
	},
};
