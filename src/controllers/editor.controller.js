import ArticleService from "../services/article.service.js";
import categoryService from "../services/category.service.js";
import tagService from "../services/tag.service.js";
import TagService from "../services/tag.service.js";
import notiService from "../services/noti.service.js";
export default {
	async getEditorHome(req, res) {
		try {
			// Avoid using this, SQLi
			// const { id: categoryId } = req.query; // Retrieve category ID from query parameters

			// Using editor's information to load articles
			const categoryId = req.session.user.managed_category_id;
			const user = req.session.user;
			// console.log(user); // Debug
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
			const user = req.session.user;
			const categories = await categoryService.findEditorCategory(user.user_id);
			if (categories[0]?.belong_to == null) {
				const subCate = await categoryService.findSubcategories(user.managed_category_id);
				// Extend category by subCate
				categories.push(...subCate);
			}
			const category_ids = categories.map((cat) => cat.category_id);

			const article = await ArticleService.findArticleById(id);
			if (!article) {
				// Send a 404 response if the article is not found
				return res.status(404).redirect("/404");
			}

			if (!category_ids.includes(article.category_id)) {
				return res.redirect("/404"); // This should be 403
			}

			// console.log(category); // Debug

			const tags = await tagService.findTagsByArticleId(id);

			res.render("vwEditor/edit", {
				layout: "layouts/admin.main.ejs",
				tags: tags,
				api_key: process.env.TINY_API_KEY, // Pass TinyMCE API key
				article: article, // Pass the article object to the template
			});
		} catch (error) {
			console.error("Error fetching article:", error);
			res.status(500).redirect("/500");
		}
	},
	async postReject(req, res) {
		try {
			// Extract form data from the request body
			const { articleId, reason } = req.body;
			const editorId = req.session.user.user_id; // Editor's user ID from session

			// Fetch article details
			const article = await ArticleService.findArticleById(articleId);

			if (!article) {
				return res.status(404).json({ error: "Article not found." });
			}

			// Check if the current editor has permission to reject the article
			if (article.editor_id !== editorId) {
				return res.status(403).json({ error: "Unauthorized to reject this article." });
			}

			// Update article status to "need changes"
			await ArticleService.updateArticleStatus(articleId, "need changes");

			// Create a notification for the writer
			await notiService.createNotification(
				editorId, // sender_id
				article.writer_id, // receiver_id
				reason // note_content
			);

			// Redirect back with success message
			res.redirect(`/editor/edit?id=${articleId}`);
		} catch (error) {
			console.error("Error rejecting article:", error);
			res.status(500).redirect("/500");
		}
	},
};
