
import adminControllerSang from "../controllers/admin.controller.sang.js";
import adminController from '../controllers/admin.controller.js'; 
import express from "express";
const router = express.Router();

router.get('/', (req, res) => {
    adminController.showArticlesPage(req, res);
});

router.get("/writers", adminController.getWriters)
router.get('/writers/detail', adminController.getWriterDetails);

router.get("/editor", adminControllerSang.getEditors);
router.get("/editor/detail", adminControllerSang.getEditorDetails);
router.post("/editor/:user_id/delete", adminControllerSang.deleteUser);
router.post("/editor/:user_id/submit", adminControllerSang.updateProfile);

router.get("/categories", adminControllerHuy.getCategories);

export default router;
