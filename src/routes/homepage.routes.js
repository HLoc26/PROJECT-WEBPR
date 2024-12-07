import express from "express";

const router = express.Router();

router.get("/", function (req, res) {
	res.render("vwHomepage/Homepage");
});

router.get("/list", function(req,res){
    res.render("vwHomepage/List");
});
export default router;