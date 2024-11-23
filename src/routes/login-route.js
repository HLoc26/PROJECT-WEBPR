import express, { Router } from "express";

const router = express.Router();

router.get("/register", function(req,res)
{
    res.render("vwLogin/Register");
})


router.get("/login", function(req,res){
    res.render("vwLogin/Login");
});

export default Router;