import express from "express";

const router = express.Router();

router.get("/", function (req, res) {
	res.render("vwEditor/Editorpage");
});

export default router;