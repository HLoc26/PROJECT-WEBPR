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
// Note: categoryRoutes are handled through apiRoutes

import configViewEngine from "./config/viewEngine.js";
import { setLocalCategories } from "./middlewares/category.mdw.js";
import { setUser } from "./middlewares/user.mdw.js";
import { isAuth, isEditor, isWriter, isAdmin } from "./middlewares/auth.mdw.js";
import { publish } from "./middlewares/publish.js";

// Initialize express app
const app = express();

configViewEngine(app);

app.use(
	express.urlencoded({
		extended: true,
	})
);
app.use("/api", apiRoutes);

// Quang: Middleware to set category variable - using direct DB access for better performance
app.use(setLocalCategories);

// Dùng session để lưu trạng thái đăng nhập
app.use(
	session({
		secret: process.env.SESSION_SECRET,
		resave: false,
		saveUninitialized: true,
		cookie: {
			maxAge: 1000 * 60 * 60, // 1 h
			secure: false,
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
app.use("/", defaultRoute); // Lộc: Sửa route để khỏi trùng
app.use("/article", articleRoutes); // Lộc: Thêm route còn thiếu
app.use("/homepage", homepageRoute);
app.use("/auth", authRoutes);

// Protected routes with role-specific middleware
app.use("/editor", isAuth, isEditor, editorRoute);
app.use("/writer", isAuth, isWriter, writerRoute);
app.use("/admin", isAuth, isAdmin, adminRoutes);

// Protected routes - no specific role required
app.use("/profile", isAuth, profileRoute);

app.listen(process.env.PORT, function (req, res) {
	console.log(`Listening on ${process.env.HOST_NAME}:${process.env.PORT}`);
});
