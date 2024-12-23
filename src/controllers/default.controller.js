import bcrypt from "bcrypt";
import userService from "../services/user.service.js";
import { validationResult } from "express-validator";
import "dotenv/config";
import articleService from "../services/article.service.js";

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
		try {
			const { email, password } = req.body;

			// Find user by email or username with complete user information
			const userByEmail = await userService.findByEmail(email);
			const userByUsername = await userService.findUserByUsername(email);
			const user = userByEmail || userByUsername;

			if (!user) {
				return res.status(400).render("vwLogin/Login", {
					layout: "layouts/login.main.ejs",
					errors: [{ msg: "Email/Username không tồn tại" }],
				});
			}

			// Verify password
			const match = await bcrypt.compare(password, user.password);
			if (!match) {
				return res.status(400).render("vwLogin/Login", {
					layout: "layouts/login.main.ejs",
					errors: [{ msg: "Mật khẩu không đúng" }],
				});
			}

			// Set session with complete user information
			req.session.user = user;

			// Update every archived articles to published
			const articles = await articleService.findByStatus("archived");
			const currentTime = new Date();
			articles.forEach(async (article) => {
				if (article.published_date < currentTime) {
					await articleService.updateArticleStatus(article.article_id, "published");
				}
			});

			// Redirect based on role
			switch (user.user_role) {
				case "reader":
					res.redirect("/homepage");
					break;
				case "writer":
					res.redirect("/writer");
					break;
				case "editor":
					res.redirect(`/editor/home`);
					break;
				case "admin":
					res.render("vwAdmin/Dashboard", {
						layout: "layouts/admin.main.ejs",
						user: req.session.user,
					});
					break;
				default:
					res.redirect("/homepage");
			}
		} catch (error) {
			console.error("Login error:", error);
			res.status(500).redirect("/500");
		}
	},
	async getLogout(req, res) {
		try {
			// console.log("User logging out: ", req.session.user.user_id); // debug

			req.session.destroy(function (err) {
				if (err) {
					console.log("Error destroying session", err);
					return res.status(500).redirect("/500");
				}
				res.locals.user = null;
				res.redirect("/login");
			});
		} catch (error) {
			console.error("Logout error:", error);
			res.status(500).redirect("/500");
		}
	},
};
