import "dotenv/config";
import express from "express";

const router = express.Router();

router.get("/", function (req, res) {
	res.render("vwWriter/Writer", {
		layout: "layouts/admin.main.ejs",
	});
});

router.get("/NewArticle", function (req, res) {
	res.render("vwWriter/NewArticle", {
		layout: "layouts/admin.main.ejs", // Lộc: Dùng layout của admin thay vì của reader
		api_key: process.env.TINY_API_KEY, // Lộc: API key TINY MCE (xem .env.example và tut của thầy)
	});
});

export default router;
