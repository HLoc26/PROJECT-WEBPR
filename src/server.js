import express from "express";
import "dotenv/config";
import webRoutes from "./routes/web.js";
import apiRoutes from "./routes/api.js";
import configViewEngine from "./config/viewEngine.js";

// Initialize express app
const app = express();

configViewEngine(app);
// When route starts with "/", use webRoutes to handle
app.use("/", webRoutes);
// When route starts with "/api", use apiRoutes to handle
app.use("/api", apiRoutes);

app.listen(process.env.PORT, function (req, res) {
	console.log(`Listening on ${process.env.HOST_NAME}:${process.env.PORT}`);
});
