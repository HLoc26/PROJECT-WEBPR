import "dotenv/config";
import articleService from "../services/article.service.js";
import express from "express";
import upload from "../config/upload.js";
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
			return res.status(404).redirect("/error/500"); // Handle article not found
		}

		res.render("vwWriter/edit", {
			layout: "layouts/admin.main.ejs",
			api_key: process.env.TINY_API_KEY, // Pass TinyMCE API key
			article: article, // Pass the article object to the template
		});
	} catch (error) {
		console.error("Error fetching article:", error);
		res.status(500).redirect("/error/404"); // Handle errors
	}
});

router.post("/new", upload.single("thumbnail"), function (req, res) {
	console.log(req.body);
	console.log(req.file);
	// const { status, title, summary, content, category } = req.body;
});

export default router;
