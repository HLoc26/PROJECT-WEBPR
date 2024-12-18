import bcrypt from "bcrypt";
import userService from "../services/user.service.js";
import "dotenv/config";
export default {
	async postRegister(req, res) {
		console.log(req.body); // Debug
		// Assume that password and password2 is the same
		const { username, email, password, password2, fullname, dob } = req.body;
		const pwd = await bcrypt.hash(password, +process.env.PASSWORD_ROUND);

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
};
