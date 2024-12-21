import express from 'express';
import articleController from '../controllers/article.controller.js';

const router = express.Router();

router.get("/:id", articleController.getArticleDetail);

export default router;