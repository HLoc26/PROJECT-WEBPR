// API routes here
import { Router } from "express";
import apiController from "../controllers/api.controller.js";
import upload from "../config/upload.js";
const router = Router();

// API so that writer could upload images in content
router.post("/images/upload", upload.single("image"), apiController.imgUpload);

export default router;
