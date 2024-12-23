import ArticleService from '../services/article.service.js';
import UserService from '../services/user.service.js';

export default {
    async getArticleDetail(req, res) {
        try {
            const articleId = req.params.id || req.query.id;
    
            // Fetch article details
            const article = await ArticleService.findArticleById(articleId);
            if (!article) {
                return res.status(404).redirect('/404'); // Article not found
            }
    
            // Check if the article is premium
            if (article.is_premium) {
                const user = req.session.user;
                // console.log(user);
                if (!user) {
                    return res.redirect('/login');
                }
    
                // Validate premium status
                const isPremiumUser = user.premium && user.subscription_expired_date && new Date(user.subscription_expired_date) > new Date();
                // console.log(isPremiumUser);
                if (!isPremiumUser) {
                    return res.status(403).redirect('/404');
                    //Chỗ này nên hiện wanning với nút bấm đăng ký premium rồi redirect to login.
                }
            }
    
            // Fetch comments and related articles in parallel
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
    },

    async postComment(req, res) {
        try {
            const articleId = req.params.id;
            const { content } = req.body;
            const userId = req.session.user?.user_id;

            if (!userId) {
                return res.redirect('/login');
            }

            await ArticleService.addComment({
                article_id: articleId,
                user_id: userId,
                content: content,
                created_at: new Date()
            });

            res.redirect(`/article/${articleId}`);
        } catch (error) {
            console.error('Error posting comment:', error);
            res.status(500).redirect('/500');
        }
    }
};
