import express from "express";
import "dotenv/config";

import apiRoutes from "./routes/api.routes.js";
import articleRoutes from "./routes/article.routes.js"; // Lộc: Sáng import thiếu
import defaultRoute from "./routes/default.routes.js";
import writerRoute from "./routes/writer.routes.js";
import homepageRoute from "./routes/homepage.routes.js";
import editorRoute from "./routes/editor.routes.js";

import configViewEngine from "./config/viewEngine.js";

// Initialize express app
const app = express();

configViewEngine(app);

app.use(
	express.urlencoded({
		extended: true,
	})
);

// When route starts with "/api", use apiRoutes to handle
app.use("/", defaultRoute); // Lộc: Sửa route để khỏi trùng
app.use("/api", apiRoutes);
app.use("/article", articleRoutes); // Lộc: Thêm route còn thiếu
app.use("/writer", writerRoute);
app.use("/homepage", homepageRoute);
app.use("/list", homepageRoute);
app.use("/editor", editorRoute);

app.listen(process.env.PORT, function (req, res) {
	console.log(`Listening on ${process.env.HOST_NAME}:${process.env.PORT}`);
});
