import express from "express";
import "dotenv/config";

import webRoutes from "./routes/web.js";
import apiRoutes from "./routes/api.js";
import loginRoute from "./routes/login.routes.js";
import writerRoute from "./routes/writer.routes.js";
import homepageRoute from "./routes/homepage.routes.js";
import editorRoute from "./routes/editor.routes.js";

import configViewEngine from "./config/viewEngine.js";
// Initialize express app
const app = express();

// Huy: Middleware for static file (css, js, img,...)
app.use(express.static(path.join(process.cwd(), "public")));

configViewEngine(app);

// When route starts with "/", use webRoutes to handle
app.use("/", webRoutes);
// When route starts with "/api", use apiRoutes to handle
app.use("/api", apiRoutes);

app.use("/login", loginRoute);
app.use("/writer", writerRoute);
app.use("/homepage", homepageRoute);
app.use("/list", homepageRoute);
app.use("/editor", editorRoute);

app.listen(process.env.PORT, function (req, res) {
	console.log(`Listening on ${process.env.HOST_NAME}:${process.env.PORT}`);
});
