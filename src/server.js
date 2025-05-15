import express from "express";
import session from "express-session";
import dotenv from "dotenv";
dotenv.config();
import configurePassport from "./config/passport.js";

import adminRoutes from "./routes/admin.routes.js";
import apiRoutes from "./routes/api.routes.js";
import articleRoutes from "./routes/article.routes.js";
import defaultRoute from "./routes/default.routes.js";
import writerRoute from "./routes/writer.routes.js";
import homepageRoute from "./routes/homepage.routes.js";
import editorRoute from "./routes/editor.routes.js";
import profileRoute from "./routes/profile.routes.js";
import authRoutes from "./routes/auth.routes.js";

import configViewEngine from "./config/viewEngine.js";
import { setLocalCategories } from "./middlewares/category.mdw.js";
import { setUser } from "./middlewares/user.mdw.js";
import { isAuth, isEditor, isWriter, isAdmin } from "./middlewares/auth.mdw.js";
import { publish } from "./middlewares/publish.js";

import helmet from "helmet";

// Initialize express app
const app = express();

// CSP configuration with reCAPTCHA and Google Fonts support
app.use(
	helmet.contentSecurityPolicy({
		directives: {
			defaultSrc: ["'self'"],
			scriptSrc: [
				"'self'",
				"https://cdn.jsdelivr.net", // Bootstrap JS
				"https://unpkg.com",
				"https://www.google.com/recaptcha/", // reCAPTCHA
				"https://www.gstatic.com/recaptcha/", // reCAPTCHA
			],
			styleSrc: [
				"'self'",
				"https://cdn.jsdelivr.net", // Bootstrap CSS
				"https://unpkg.com",
				"https://fonts.googleapis.com", // Google Fonts
			],
			imgSrc: [
				"'self'",
				"data:",
				"https://cdn.jsdelivr.net",
				"https://banner2.cleanpng.com", // Custom image source
			],
			fontSrc: [
				"'self'",
				"https://cdn.jsdelivr.net",
				"https://fonts.googleapis.com",
				"https://fonts.gstatic.com", // Actual font source for Google Fonts
			],
			connectSrc: [
				"'self'",
				"https://www.google.com/recaptcha/", // reCAPTCHA API
				"https://www.gstatic.com/recaptcha/", // reCAPTCHA API
			],
			frameSrc: [
				"'self'",
				"https://www.google.com/recaptcha/", // reCAPTCHA iframe
				"https://www.gstatic.com/recaptcha/",
			],
			frameAncestors: ["'self'"],
			formAction: ["'self'"],
			objectSrc: ["'none'"],
			upgradeInsecureRequests: [],
			reportTo: "/csp-report", // Report CSP violations
		},
	})
);

app.use((req, res, next) => {
	const originalWriteHead = res.writeHead;

	res.writeHead = function (statusCode, ...args) {
		// Nếu là redirect (3xx) và chưa có CSP
		res.setHeader(
			"Content-Security-Policy",
			"default-src 'self'; " +
				"script-src 'self' https://www.google.com/recaptcha/ https://www.gstatic.com/recaptcha/ https://cdn.jsdelivr.net; " +
				"style-src 'self' https://fonts.googleapis.com https://cdn.jsdelivr.net; " +
				"font-src 'self' https://fonts.gstatic.com; " +
				"img-src 'self' data:; " +
				"frame-src 'self' https://www.google.com/recaptcha/ https://www.gstatic.com/recaptcha/; " +
				"connect-src 'self' https://www.google.com/recaptcha/ https://www.gstatic.com/recaptcha/; " +
				"form-action 'self'; " +
				"frame-ancestors 'self'; " +
				"object-src 'none'; " +
				"base-uri 'self';"
		);

		return originalWriteHead.call(this, statusCode, ...args);
	};

	next();
});

// CSP violation report endpoint
app.post("/csp-report", express.json(), (req, res) => {
	console.log("CSP Violation:", req.body);
	res.status(204).end();
});
app.use((req, res, next) => {
	res.on("finish", () => {
		if (!res.getHeader("Content-Security-Policy")) {
			console.warn(`CSP header missing for ${req.originalUrl}`);
		}
	});
	next();
});

app.use(
	helmet.frameguard({
		action: "DENY",
	})
);

configViewEngine(app);

app.use(
	express.urlencoded({
		extended: true,
	})
);
app.use("/api", apiRoutes);

// Middleware to set category variable
app.use(setLocalCategories);

// Session configuration
app.use(
	session({
		secret: process.env.SESSION_SECRET,
		resave: false,
		saveUninitialized: true,
		cookie: {
			maxAge: 1000 * 60 * 60, // 1 hour
			secure: process.env.NODE_ENV === "production", // Secure cookie in production
		},
	})
);

configurePassport(app);

app.use(setUser);
app.use(publish);

// Add reCAPTCHA site key to locals
app.use((req, res, next) => {
	res.locals.GOOGLE_RECAPTCHA_SITE_KEY = process.env.GOOGLE_RECAPTCHA_SITE_KEY;
	next();
});

// Public routes
app.use("/", defaultRoute);
app.use("/article", articleRoutes);
app.use("/homepage", homepageRoute);
app.use("/auth", authRoutes);

// Protected routes with role-specific middleware
app.use("/editor", isAuth, isEditor, editorRoute);
app.use("/writer", isAuth, isWriter, writerRoute);
app.use("/admin", isAuth, isAdmin, adminRoutes);

// Protected routes - no specific role required
app.use("/profile", isAuth, profileRoute);

// Catch-all for undefined routes (handles 404s)
app.use((req, res, next) => {
	// Redirect to /404 page
	res.redirect("/404");
});

// 404 page route
app.use("/404", (req, res) => {
	res.status(404).render("vwError/404");
});

// Error handling middleware
app.use((err, req, res, next) => {
	console.error(err.stack);
	res.status(500).send("Something went wrong!");
});

app.listen(process.env.PORT, function () {
	console.log(`Listening on ${process.env.HOST_NAME}:${process.env.PORT}`);
});
