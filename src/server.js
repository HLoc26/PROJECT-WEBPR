import express from "express";
import "dotenv/config";
import configViewEngine from "./config/viewEngine.js";

import path from "path"; // Thư viện xử lý đường dẫn

// Initialize express app
const app = express();

configViewEngine(app);

app.use(express.static(path.join(process.cwd(), "public")));

// Huy: add route
app.get("/", function (req, res) {
  res.render("home", {
    title: "Homepage",
  });
});

app.listen(process.env.PORT, function (req, res) {
  console.log(`Listening on ${process.env.HOST_NAME}:${process.env.PORT}`);
});
