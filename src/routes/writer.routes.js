import express from "express";
import upload from "../config/upload.js";
import writerController from "../controllers/writer.controller.js";
const router = express.Router();

router.get("/", writerController.getHome);

router.get("/new", writerController.getNew);

router.get("/edit", writerController.getEdit);

router.post("/new", upload.single("thumbnail"), writerController.postNew);

router.post("/edit", upload.single("thumbnail"), writerController.postEdit);

export default router;
