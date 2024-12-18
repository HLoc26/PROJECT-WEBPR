import express from "express";

const router = express.Router();

router.get("/register", function (req, res) {
	res.render("vwLogin/Register", { layout: "layouts/login.main.ejs" });
});

router.post("/register", function (req, res) {
	// code to handle the form data
});

router.get("/login", function (req, res) {
	res.render("vwLogin/Login", { layout: "layouts/login.main.ejs" });
});

router.post("/login", function (req, res) {
	// code to handle the form data
});

router.get("/forget", function (req, res) {
	res.render("vwLogin/Forget", { layout: "layouts/login.main.ejs" });
});

router.get("/OTP", function (req, res) {
	res.render("vwLogin/OTP", { layout: "layouts/login.main.ejs" });
});

router.get("/404", function (req, res) {
	res.render("vwError/404", { layout: "layouts/login.main.ejs" });
});

router.get("/500", function (req, res) {
	res.render("vwError/500", { layout: "layouts/login.main.ejs" });
});
export default router;