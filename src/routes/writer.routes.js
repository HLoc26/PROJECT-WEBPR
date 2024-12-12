import "dotenv/config";
import articleService from "../services/article.service.js";
import express from "express";
import path from "path";
import { write } from "fs";
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
		layout: "layouts/admin.main.ejs", // Lộc: Dùng layout của admin thay vì của reader
		api_key: process.env.TINY_API_KEY, // Lộc: API key TINY MCE (xem .env.example và tut của thầy)
	});
});
router.get("/edit", async function (req, res) {
	const id = req.query.id;
	try {
		const article = await articleService.findArticleById(id);
		if (!article) {
			// Send a 404 response if the article is not found
			return res.status(404).redirect("/error/500");
		}

		console.log(article); // Note: fixed the "edit" variable to "article"
		res.render("vwWriter/edit", {
			article: article,
			layout: "layouts/admin.main.ejs",
			api_key: process.env.TINY_API_KEY,
		});
	} catch (error) {
		console.error("Error fetching article:", error);
		res.status(500).redirect("/error/404");
	}
});

router.post("/new", function (req, res) {
	console.log(req.body);
	// const { status, title, summary, content, category } = req.body;
});

export default router;
