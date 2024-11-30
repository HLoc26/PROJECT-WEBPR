import express from "express";

const router = express.Router();

router.get("/", function (req, res) {
	res.render("vwHomepage/Homepage");
});

router.get("/List", function (req, res) {
	res.render("layout/reader.main.ejs", { body: "../vwHomepage/List" });
});

router.get("/Category", function (req, res) {
	res.render("layout/reader.main.ejs", { body: "../vwHomepage/Category" });
});
export default router;
