export function isEditor(req, res, next) {
	console.log("editor", req.session.user);
	if (req.session && req.session.user) {
		if (req.session.user.user_role === "editor") {
			return next();
		} else {
			return res.redirect("/404");
		}
	} else {
		return res.redirect("/404");
	}
}