import adminControllerSang from "../controllers/admin.controller.sang.js";
import adminController from '../controllers/admin.controller.js'; 
import adminUsersController from "../controllers/reader.controller.js";
import express from "express";
import adminControllerHuy from "../controllers/admin.controller.huy.js";
const router = express.Router();

router.get("/", (req, res) => {
	adminController.showArticlesPage(req, res);
});
router.post('/',  express.json(), adminController.publishArticle);

router.get("/writers", adminController.getWriters);
router.get("/writers/detail", adminController.getWriterDetails);

router.get("/readers", adminUsersController.getReaderUsers);
router.get("/readers/:id", adminUsersController.getUserDetails);                                 
router.post("/readers/:id/register-premium", adminUsersController.registerPremium);
router.post("/readers/:id/unsubscribe-premium", adminUsersController.unsubscribePremium);

router.get("/tags", adminController.getAllTags);
router.get("/tags/:id", adminController.getTagById);
router.post("/tags/add", adminController.addTag);
router.post("/tags/:id/edit", adminController.updateTag);
router.post("/tags/:id/delete", adminController.deleteTag);

router.get("/editor", adminControllerSang.getEditors);
router.get("/editor/detail", adminControllerSang.getEditorDetails);
router.post("/editor/:user_id/delete", adminControllerSang.deleteUser);
router.post("/editor/:user_id/submit", adminControllerSang.updateProfile);

// Category managementAdd routers to manage categories
router.get("/categories", adminControllerHuy.getCategories);
router.get("/categories/add", adminControllerHuy.getAddCategories);
router.post("/categories/add", adminControllerHuy.addCategories);
router.get("/categories/edit", adminControllerHuy.getEditCategories);
router.post("/categories/patch", adminControllerHuy.editCategories);

export default router;
