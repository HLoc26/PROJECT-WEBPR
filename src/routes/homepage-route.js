import express from "express";

const router = express.Router();
router.get("/Homepage", function (req, res) {
	res.render("vwHomepage/Homepage");
});

export default Router;