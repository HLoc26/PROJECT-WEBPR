import express from "express";
import editorController from "../controllers/editor.controller.js";
const router = express.Router();

router.get("/home", editorController.getEditorHome);
router.get("/edit", editorController.getEdit);
router.post("/approve", editorController.postApprove);
export default router;
