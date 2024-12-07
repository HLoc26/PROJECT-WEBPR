import { Router } from "express";
import controllers from "../controllers/main.controller.js";
const router = Router();

router.get("/", controllers.getHomepage);

router.get("/news", controllers.getNews);

export default router;
