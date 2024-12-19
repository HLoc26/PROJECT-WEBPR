import express from 'express';
import articleService from '../services/article.service.js';

const router = express.Router();

router.get("/:id", async function (req, res) {
    try {
        const articleId = req.query.id || req.params.id;
        console.log('Requested article ID:', articleId);

        const article = await articleService.findArticleById(articleId);
        console.log('Article found:', article);
        
        if (!article) {
            console.log('Article not found for ID:', articleId);
            return res.status(404).redirect('/404');
        }

        const [comments, relatedArticles] = await Promise.all([
            articleService.findCommentsById(articleId),
            articleService.findRelatedArticles(
                parseInt(articleId), 
                parseInt(article.category_id), 
                5
            )
        ]);

        console.log('Comments found:', comments.length);
        console.log('Related articles found:', relatedArticles.length);

        res.render("vwArticle/Detail", {
            article,
            comments,
            relatedArticles
        });
    } catch (error) {
        console.error('Error loading article:', error);
        console.error('Stack trace:', error.stack);
        res.status(500).redirect('/500');
    }
});

export default router;