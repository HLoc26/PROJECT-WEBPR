import express from "express";

const router = express.Router();

router.get("/Homepage", function (req, res) {
	res.render("vwHomepage/Homepage");
});

router.get("/List", function(req,res){
    res.render("vwHomepage/List");
})

export default Router;