import express from "express";

const router = express.Router();

router.get("/", function (req, res) {
	res.render("vwEditor/editorhome");
});

export default router;
