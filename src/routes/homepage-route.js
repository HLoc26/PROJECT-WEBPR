import express from "express";

const router = express.Router();

router.get("/", function (req, res) {
	res.render("vwHomepage/Homepage");
});

router.get("/List", function(req,res){
    res.render("vwHomepage/List");
});

router.get("/Category", function(res,req){
    res.render("vwHomepage/Category");
})
export default router;