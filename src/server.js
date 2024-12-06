import express from "express";
import "dotenv/config";
import configViewEngine from "./config/viewEngine.js";

import path from "path"; // Huy: add path processing library.

// Initialize express app
const app = express();

// Huy: Middleware for static file (css, js, img,...)
app.use(express.static(path.join(process.cwd(), "public")));

configViewEngine(app);

// Huy: add route
app.get("/", function (req, res) {
  res.render("layouts/reader.main", {
    body: "Welcome to E-News!",
  });
});

app.listen(process.env.PORT, function (req, res) {
	console.log(`Listening on ${process.env.HOST_NAME}:${process.env.PORT}`);
});
