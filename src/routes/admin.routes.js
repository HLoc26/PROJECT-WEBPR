import adminControllerSang from "../controllers/admin.controller.sang.js";
import express from "express";
const router = express.Router();

router.get("/editor", adminControllerSang.getEditors);

export default router;
