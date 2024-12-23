import express from "express";
import homeController from "../controllers/homepage.controller.js";
import articleService from "../services/article.service.js";
import tagController from "../controllers/tag.controller.js";
const router = express.Router();

router.get("/", homeController.GetHomepage);
// router.get("/", function (req, res) {
// 	res.render("vwHomepage/Homepage");
// });

router.get("/art-card", async (req, res) => {
	// Get most viewed articles
	const mostViewedArticles = await articleService.findAllArticles();
	const top10MostViewed = mostViewedArticles.sort((a, b) => b.views - a.views).slice(0, 10);

	console.log(top10MostViewed);

	// Render the homepage with all required data
	res.render("vwHomepage/test", {
		articles: top10MostViewed,
	});
});

router.get("/tag", tagController.getArticlesByTag);

router.get("/cate", homeController.getCategoryArticles);

router.get("/search", async function (req, res) {
	const query = req.query.q;

	// console.log(query); // Debug

	const is_premium = req.session.user ? req.session.user.premium : false;
	console.log("Premium status:", is_premium);
	console.log(req.session.user);

	const results = await articleService.search(query, is_premium);

	// console.log(results); // Debug

	res.render("vwHomepage/Search", {
		query: query,
		results: results,
	});
});

export default router;
