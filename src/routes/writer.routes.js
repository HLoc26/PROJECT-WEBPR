import "dotenv/config";
import articleService from "../services/article.service.js";
import express from "express";
import upload from "../config/upload.js";
import tagService from "../services/tag.service.js";
const router = express.Router();

router.get("/", async function (req, res) {
	// Loc: This ID is just for test, will have to change after
	// login and register function is complete
	const writer_id = 1;

	const articles = await articleService.findByWriterId(writer_id);

	// console.log(articles);

	res.render("vwWriter/Writer", {
		layout: "layouts/admin.main.ejs",
		articles: articles,
	});
});

router.get("/new", function (req, res) {
	res.render("vwWriter/edit", {
		layout: "layouts/admin.main.ejs", // Admin layout
		api_key: process.env.TINY_API_KEY, // TinyMCE API key
		article: null, // Pass null to indicate no article data
	});
});

router.get("/edit", async function (req, res) {
	const id = req.query.id; // Fetch article ID from the query string
	try {
		const article = await articleService.findArticleById(id);
		if (!article) {
			// Send a 404 response if the article is not found
			return res.status(404).redirect("/404");
		}

		const tagObj = await tagService.findTagsByArticleId(id);
		const tagName = tagObj.map((tag) => tag.tag_name);

		// console.log("article tags: ", tagName);

		res.render("vwWriter/edit", {
			layout: "layouts/admin.main.ejs",
			api_key: process.env.TINY_API_KEY, // Pass TinyMCE API key
			article: article, // Pass the article object to the template
			tags: tagName,
		});
	} catch (error) {
		console.error("Error fetching article:", error);
		res.status(500).redirect("/error/500"); // Handle errors
		res.status(500).redirect("/500");
	}
});

router.post("/new", upload.single("thumbnail"), async function (req, res) {
	try {
		console.log(req.body);
		console.log(req.file);
		const { title, summary, content, category, premium, tags } = req.body;
		const writer_id = req.session.user.user_id;
		const is_premium = premium === "on" ? 1 : 0;
		const tagsArr = tags
			.split(",")
			.map((tag) => tag.trim())
			.filter((tag) => tag !== "");
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
});

export default router;
