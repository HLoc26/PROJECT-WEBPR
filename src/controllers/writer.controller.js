import articleService from "../services/article.service.js";
import tagService from "../services/tag.service.js";
import notiService from "../services/noti.service.js";
import "dotenv/config";

export default {
	async getHome(req, res) {
		// Loc: This ID is just for test, will have to change after
		// login and register function is complete
		const writer_id = req.session.user.user_id;

		const articles = await articleService.findByWriterId(writer_id);
		const approvalHistory = await notiService.getApprovalHistory(writer_id);
		// console.log(articles);

		res.render("vwWriter/Writer", {
			layout: "layouts/admin.main.ejs",
			articles: articles,
			approvalHistory: approvalHistory,
		});
	},
	getNew(req, res) {
		res.render("vwWriter/edit", {
			layout: "layouts/admin.main.ejs", // Admin layout
			api_key: process.env.TINY_API_KEY, // TinyMCE API key
			article: null, // Pass null to indicate no article data
		});
	},
	async getEdit(req, res) {
		const id = req.query.id; // Fetch article ID from the query string
		const writer_id = req.session.user.user_id; // Get writer ID from session

		try {
			// Fetch the article by ID
			const article = await articleService.findArticleById(id);
			if (!article) {
				return res.status(404).redirect("/404"); // Article not found
			}

			// Fetch tags associated with the article
			const tagObj = await tagService.findTagsByArticleId(id);
			const tagName = tagObj.map((tag) => tag.tag_name);

			// Fetch approval history (used for notifications)
			const notifications = await notiService.getApprovalHistory(writer_id);

			// Filter notifications by the specific article ID
			const filteredNotifications = notifications.filter((n) => n.article_id == id);

			// Render the edit page
			res.render("vwWriter/edit", {
				layout: "layouts/admin.main.ejs",
				api_key: process.env.TINY_API_KEY, // TinyMCE API key
				article: article, // Article object
				tags: tagName, // Tags array
				notifications: filteredNotifications, // Notifications specific to this article
			});
		} catch (error) {
			console.error("Error fetching article or notifications:", error);
			res.status(500).redirect("/500");
		}
	},

	async postNew(req, res) {
		try {
			// console.log(req.body);
			// console.log(req.file);
			const { title, summary, content, category, premium, tags } = req.body;
			const writer_id = req.session.user.user_id;
			const is_premium = premium === "on" ? 1 : 0;
			const thumbnail = req.file ? req.file.filename : "default-thumbnail.jpg";

			const entity = {
				title: title,
				content: content,
				abstract: summary,
				thumbnail: thumbnail,
				views: 0,
				status: "waiting",
				published_date: null,
				is_premium: is_premium,
				writer_id: writer_id,
				category_id: category,
				editor_id: null,
			};
			console.log(entity);
			const articleId = await articleService.addArticle(entity);

			// Check if all the tags are already in the database if not, add them
			// Get existing tags from DB
			const tagsArr = [
				...new Set(
					tags
						.split(",")
						.map((tag) => tag.trim())
						.filter((tag) => tag !== "")
				),
			];
			const tagsInDb = await tagService.findAllTags();
			const existingTagNames = tagsInDb.map((tag) => tag.tag_name);

			// console.log(existingTagNames);

			// Process each tag
			for (const tagName of tagsArr) {
				let tagId;

				// If tag doesn't exist in DB, add it
				if (!existingTagNames.includes(tagName)) {
					tagId = await tagService.addTag(tagName);
				} else {
					// Get the ID of existing tag
					tagId = tagsInDb.find((tag) => tag.tag_name === tagName).tag_id;
				}

				// Add article-tag relationship
				await tagService.addTagToArticle(articleId, tagId);
			}

			// Redirect to writer's dashboard or article list
			res.redirect("/writer");
		} catch (error) {
			console.error("Error creating article:", error);
			res.status(500).redirect("/500");
		}
	},

	async postEdit(req, res) {
		const articleId = req.query.id;
		const { title, summary, content, category, premium, tags } = req.body;
		const is_premium = premium === "on" ? 1 : 0;
		const originalArticle = await articleService.findArticleById(articleId);

		const thumbnail = req.file ? req.file.filename : originalArticle.thumbnail;
		const entity = {
			title: title,
			content: content,
			abstract: summary,
			thumbnail: thumbnail,
			status: "waiting",
			is_premium: is_premium,
			category_id: category,
			editor_id: null,
		};

		await articleService.updateArticle(articleId, entity);

		// Lấy danh sách tag từ request
		const tagsArr = tags
			.split(",")
			.map((tag) => tag.trim())
			.filter((tag) => tag !== "");

		// Xóa các tag không còn trong danh sách mới
		await tagService.removeTagsFromArticle(articleId);
		const tagsInDb = await tagService.findAllTags();
		const existingTagNames = tagsInDb.map((tag) => tag.tag_name);

		// Thêm các tag mới
		for (const tagName of tagsArr) {
			let tagId;

			if (!existingTagNames.includes(tagName)) {
				tagId = await tagService.addTag(tagName);
			} else {
				tagId = tagsInDb.find((tag) => tag.tag_name === tagName).tag_id;
			}

			await tagService.addTagToArticle(articleId, tagId);
		}

		// Redirect to writer's dashboard or article list
		res.redirect("/writer");
	},
};
