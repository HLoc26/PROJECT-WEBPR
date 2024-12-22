import adminControllerSang from "../controllers/admin.controller.sang.js";
import express from "express";
const router = express.Router();

router.get("/editor", adminControllerSang.getEditors);
router.get("/editor/detail", adminControllerSang.getEditorDetails);
router.post("/editor/:user_id/delete", adminControllerSang.deleteUser);
router.post("/editor/:user_id/submit", adminControllerSang.updateProfile);

export default router;
