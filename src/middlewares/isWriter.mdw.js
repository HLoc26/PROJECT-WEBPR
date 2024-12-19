export function isWriter(req, res, next) {
	// console.log("writer", req.session.user);
	if (req.session && req.session.user) {
		if (req.session.user.user_role === "writer") {
			return next();
		} else {
			return res.redirect("/404");
		}
	} else {
		return res.redirect("/404");
	}
}
