import express from "express";
const router = express.Router();

router.get("/404", function (req, res) {
	res.render("vwError/404");
});
router.get("/500", function (req, res) {
	res.render("vwError/500");
});

export default router;
