import "dotenv/config";
import articleService from "../services/article.service.js";
import express from "express";
import path from "path";
const router = express.Router();

router.get("/", function (req, res) {
	res.render("vwWriter/Writer", {
		layout: "layouts/admin.main.ejs",
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
		console.error("Error fetching article:", err);
		res.status(500).redirect("/error/404");
	}
});

export default router;
