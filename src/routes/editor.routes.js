import express from "express";
import editorController from "../controllers/editor.controller.js";
const router = express.Router();

router.get("/home", editorController.getEditorHome);
export default router;
