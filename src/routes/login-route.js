import express,  from 'express';

const router = express.Router();

router.get("/register", function(req,res)
{
    res.render("vwLogin/Register");
})

router.post("register", function(req,res){
    // code to handle the form data
})

router.get("/login", function(req,res){
    res.render("vwLogin/Login");
});

router.post("/login", function(req,res){
    // code to handle the form data
})

router.get("/forget", function(req,res){
    res.render("vwLogin/Forget");
})

router.get("/OTP", function(req,res){
    res.render("vwLogin/OTP");
})
export default Router;