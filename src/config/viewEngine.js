import { join } from "path";
import express from "express";

import expressLayouts from "express-ejs-layuts";

// Set view to render html from ./views/sample.ejs
const configViewEngine = (app) => {
  app.set("views", join("./src", "views"));
  app.set("view engine", "ejs");

  app.use(expressLayouts); // Kích hoạt express-ejs-layouts
  app.set("layout", "layouts/reader.main.ejs"); // Đặt layout mặc định

  // Config static files
  app.use(express.static(join("./src", "public")));
};

export default configViewEngine;
