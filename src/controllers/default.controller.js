import bcrypt from "bcrypt";
import userService from "../services/user.service.js";
import { validationResult } from "express-validator";
import "dotenv/config";
export default {
	async postRegister(req, res) {
		const errors = validationResult(req);
		if (!errors.isEmpty()) {
			return res.status(400).render("vwLogin/register", { layout: "layouts/login.main.ejs", errors: errors.array() });
		}
		// console.log(req.body); // Debug
		// Assume that password and password2 is the same
		const { username, email, password, password2, fullname, dob } = req.body;
		const pwd = await bcrypt.hash(password, +process.env.PASSWORD_ROUND);

		// Check xem username và email có tồn tại không
		const usedUsername = false; // Placeholder
		const usedEmail = false; // Placeholder

		if (usedUsername) {
			return res.status(400).render("vwLogin/register", { layout: "layouts/login.main.ejs", errors: [{ msg: "Username is used" }] });
		}
		if (usedEmail) {
			return res.status(400).render("vwLogin/register", { layout: "layouts/login.main.ejs", errors: [{ msg: "Email is used" }] });
		}

		const entity = {
			username: username,
			password: pwd,
			email: email,
			full_name: fullname,
			dob: dob,
			user_role: "reader",
			is_active: 1,
			subscription_expired_date: null,
			premium: 0,
			managed_category_id: null,
		};
		console.log(entity);
		await userService.addReader(entity);

		res.redirect("/login");
	},

	async postLogin(req, res) {
		// console.log(req.body); // Debug
		// Find user by email or by username (user can use both to login)
		// Check if user is using email
		// Else, user is using username
		// Get user using email or username
		// Check match password
		// If password match, set req.session.user is the current user
		// Get user's role, then redirect to their homepage
		// User is reader: redirect to /homepage
		// User is writer: redirect to /writer
		// User is editor: redirect to /editor
		// Catch error, redirect to /404 or /500
	},
};
