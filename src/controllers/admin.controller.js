import articleService from '../services/article.service.js';
import userService from '../services/user.service.js';

export default {
    async showArticlesPage(req, res) {
        try {
            const writerIds = await userService.findAllUsers('editor');
            const writer_ids = writerIds.map(user => user.user_id);
    
            const pendingArticlePromises = writer_ids.map(writerId => 
                articleService.getArticlesByStatus(writerId, 'pending')
            );
            const pendingArticleResults = await Promise.all(pendingArticlePromises);
            const pendingArticles = pendingArticleResults.flat();
    
            const approvedArticlePromises = writer_ids.map(writerId => 
                articleService.getArticlesByStatus(writerId, 'published')
            );
            const approvedArticleResults = await Promise.all(approvedArticlePromises);
            const approvedArticles = approvedArticleResults.flat();
    
            // console.log('Approved Articles:', approvedArticles);
            // console.log('Pending Articles:', pendingArticles);
    
            res.render('../views/vwAdmin/Admin.showarticles.ejs', {
                approvedArticles: approvedArticles,
                pendingArticles: pendingArticles,
            });
        } catch (error) {
            console.error('Error fetching articles:', error);
            res.render('../views/vwError/500.ejs');
        }
    }
};