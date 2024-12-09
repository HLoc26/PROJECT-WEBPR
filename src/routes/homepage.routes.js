import express from "express";
import homeController from '../controllers/homepage.controller.js';

const router = express.Router();

router.get("/", homeController.GetHomepage);

router.get("/list", function(req,res){
    res.render("vwHomepage/List");
});
export default router;