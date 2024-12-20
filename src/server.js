import express from "express";
import session from "express-session";
import "dotenv/config";

import apiRoutes from "./routes/api.routes.js";
import articleRoutes from "./routes/article.routes.js"; // Lộc: Sáng import thiếu
import defaultRoute from "./routes/default.routes.js";
import writerRoute from "./routes/writer.routes.js";
import homepageRoute from "./routes/homepage.routes.js";
import editorRoute from "./routes/editor.routes.js";
import categoryRoutes from './routes/api.routes.js';
import authRoutes from './routes/auth.routes.js';

import configViewEngine from "./config/viewEngine.js";
import setCategoriesMiddleware from "./middlewares/category.mdw.js"; // Huy

import { setUser } from "./middlewares/user.mdw.js";

// Initialize express app
const app = express();

configViewEngine(app);

app.use(
	express.urlencoded({
		extended: true,
	})
);
app.use("/api", apiRoutes);

// Huy: Middleware to set category variable
app.use(setCategoriesMiddleware);

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

app.use(setUser);

// When route starts with "/api", use apiRoutes to handle
app.use("/", defaultRoute); // Lộc: Sửa route để khỏi trùng
app.use("/article", articleRoutes); // Lộc: Thêm route còn thiếu
app.use("/writer", writerRoute);
app.use("/homepage", homepageRoute);
app.use("/list", homepageRoute);
app.use("/editor", editorRoute);
app.use(categoryRoutes);
app.use('/api/auth', authRoutes);


app.listen(process.env.PORT, function (req, res) {
	console.log(`Listening on ${process.env.HOST_NAME}:${process.env.PORT}`);
});
