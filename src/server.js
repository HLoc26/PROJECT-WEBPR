import express from "express";
import "dotenv/config";
import configViewEngine from "./config/viewEngine.js";

// Initialize express app
const app = express();

configViewEngine(app);

app.listen(process.env.PORT, function (req, res) {
	console.log(`Listening on ${process.env.HOST_NAME}:${process.env.PORT}`);
});
