import express from "express";

const router = express.Router();

router.get("/Editor", function (req, res) {
	res.render("vwEditor/Editorpage");
});

export default router;