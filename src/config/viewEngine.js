import { join } from "path";
import express from "express";

// Set view to render html from ./views/sample.ejs
const configViewEngine = function (app) {
	app.set("views", join("./src", "views"));
	app.set("view engine", "ejs");

	// Config static files
	app.use(express.static(join("./src", "public")));
};

export default configViewEngine;
