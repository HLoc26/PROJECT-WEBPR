export function setUser(req, res, next) {
	// console.log(req.session); // Debug
	if (req.session && req.session.user) {
		res.locals.user = req.session.user;
	} else {
		res.locals.user = null;
	}
	// console.log(res.locals.user); // Debug
	next();
}
