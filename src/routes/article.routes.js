import express from 'express';
import articleService from '../services/article.service.js';

const router = express.Router();

router.get("/:id", async function (req, res) {
    try {
        const articleId = req.query.id || req.params.id;
        const article = await articleService.findArticleById(articleId);
        
        if (!article) {
            return res.status(404).redirect('/404');
        }

        // Fetch comments for this article
        const comments = await articleService.findCommentsById(articleId);
        
        // Get related articles (from same category)
        const relatedArticles = await articleService.findAllArticles();
        const filteredRelated = relatedArticles
            .filter(a => a.category_id === article.category_id && a.article_id !== article.article_id)
            .slice(0, 3);

        res.render("vwArticle/Detail", {
            article,
            comments,
            relatedArticles: filteredRelated
        });
    } catch (error) {
        console.error('Error loading article:', error);
        res.status(500).redirect('/500');
    }
});

export default router;