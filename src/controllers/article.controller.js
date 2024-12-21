import ArticleService from '../services/article.service.js';
import CategoryService from '../services/category.service.js';

export default {
    async getArticleDetail(req, res) {
        try {
            const articleId = req.params.id || req.query.id;
            
            const article = await ArticleService.findArticleById(articleId);
            if (!article) {
                return res.status(404).redirect('/404');
            }

            const [comments, relatedArticles] = await Promise.all([
                ArticleService.findCommentsById(articleId),
                ArticleService.findRelatedArticles(
                    parseInt(articleId), 
                    parseInt(article.category_id),
                    5
                )
            ]);

            res.render("vwArticle/Detail", {
                article,
                comments,
                relatedArticles
            });

        } catch (error) {
            console.error('Error in getArticleDetail:', error);
            res.status(500).redirect('/500');
        }
    }
};

