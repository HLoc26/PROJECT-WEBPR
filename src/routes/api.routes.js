// API routes here
import { Router } from "express";
import apiController from "../controllers/api.controller.js";
import tagController from "../controllers/tag.controller.js";
import upload from "../config/upload.js";

const router = Router();

// API so that writer could upload images in content
router.post("/images/upload", upload.single("image"), apiController.imgUpload);

// API to get category list
router.get("/categories", apiController.getCategories);

router.get("/homepage/tag", tagController.getArticlesByTag);

export default router;
