import adminControllerSang from "../controllers/admin.controller.sang.js";
import adminController from '../controllers/admin.controller.js'; 
import express from "express";
import adminControllerHuy from "../controllers/admin.controller.huy.js";
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

// Category managementAdd routers to manage categories
router.get("/categories", adminControllerHuy.getCategories);
router.get("/categories/add", adminControllerHuy.getAddCategories);
router.post("categories/add", adminControllerHuy.addCategories);
router.get("/categories/edit", adminControllerHuy.getEditCategories);
router.post("/categories/patch", adminControllerHuy.editCategories);

export default router;