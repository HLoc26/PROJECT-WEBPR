import express from 'express';
import articlesController from '../controllers/admin.controller.js'; 


const router = express.Router();

router.get('/', (req, res) => {
    articlesController.showArticlesPage(req, res);
});

export default router;