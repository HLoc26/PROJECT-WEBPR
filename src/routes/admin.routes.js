import adminControllerSang from "../controllers/admin.controller.sang.js";
import adminController from "../controllers/admin.controller.js";
import express from "express";
const router = express.Router();

router.get("/", (req, res) => {
	adminController.showArticlesPage(req, res);
});

router.get("/writers", adminController.getWriters);
router.get("/writers/detail", adminController.getWriterDetails);

router.get("/tags", adminController.getAllTags);
router.get("/tags/:id", adminController.getTagById);
router.post("/tags/add", adminController.addTag);
router.post("/tags/:id/edit", adminController.updateTag);
router.post("/tags/:id/delete", adminController.deleteTag);

router.get("/editor", adminControllerSang.getEditors);
router.get("/editor/detail", adminControllerSang.getEditorDetails);
router.post("/editor/:user_id/delete", adminControllerSang.deleteUser);
router.post("/editor/:user_id/submit", adminControllerSang.updateProfile);

export default router;
