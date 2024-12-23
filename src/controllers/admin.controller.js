import articleService from '../services/article.service.js';
import userService from '../services/user.service.js';

export default {
    async showArticlesPage(req, res) {
        try {
            const writerIds = await userService.findAllUsers('editor');
            const writer_ids = writerIds.map(user => user.user_id);
    
            const pendingArticlePromises = writer_ids.map(writerId => 
                articleService.getArticlesByStatus(writerId, 'waiting')
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
    
            res.render('../views/vwAdmin/Admin.dashboard.ejs', {
                layout: "layouts/admin.main.ejs",
                approvedArticles: approvedArticles,
                pendingArticles: pendingArticles,
            });
        } catch (error) {
            console.error('Error fetching articles:', error);
            res.redirect('/500');
        }
    },

    async getWriters(req, res) {
        try {
            // Lấy danh sách tất cả các writer
            const writers = await userService.findUsersByRole('writer');
    
            // Render trang danh sách writers
            res.render('../views/vwAdmin/Admin.writers.ejs', {
                writers: writers,
            });
        } catch (error) {
            console.error('Error fetching writers:', error);
            res.redirect('/500');
        }
    },

    //Xem thông tin của một editor và danh sách các bài viết đã được published thuộc về writer đó
    async getWriterDetails(req, res) {
        try {
            const writerId = req.query.id; // Change this line
            console.log('Query parameters:', req.query);
            console.log('Writer ID:', writerId);
    
            // Rest of your code remains the same
            const writerDetails = await userService.findUserById(writerId, 'writer');
            if (!writerDetails) {
                return res.status(404).redirect('/404', { message: 'Writer not found' });
            }
    
            const publishedArticles = await articleService.findByWriterId(writerId);
            const filteredArticles = publishedArticles.filter(article => article.status === 'published');
    
            res.render('../views/vwAdmin/Admin.writerDetails.ejs', {
                writer: writerDetails,
                articles: filteredArticles,
            });
        } catch (error) {
            console.error('Error fetching writer details:', error);
            res.redirect('/500');
        }
    }

};