import express from "express";
import editorController from "../controllers/editor.controller.js";
const router = express.Router();

router.get("/home", editorController.getEditorHome);
router.get("/edit", editorController.getEdit);
router.post("/approve", editorController.postApprove);
router.post("/reject", editorController.postReject);
export default router;
