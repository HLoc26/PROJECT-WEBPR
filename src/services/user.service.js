import db from "../config/db.js";

export default {
	findReaderById(id) {
		return db("users")
			.where("users.user_id", id)
			.andWhere("users.user_role", "reader")
			.first()
			.select(
                "users.user_id", 
                "users.username", 
                "users.email", 
                "users.full_name", 
                "users.dob", 
                "users.subscription_expired_date", 
                "users.premium", "users.is_active"
            );
	},

	addReader(entity) {
		return db("users").insert(entity);
	},

    registerPremium(id, subscriptionExpiredDate) {
        return db('users')
          .where('users.user_id', id)
          .andWhere('users.user_role', 'reader')
          .update({
            premium: true,
            subscription_expired_date: subscriptionExpiredDate
        });
    },
    
    sendArticleToEditor(articleId, editorId) {
        return db('articles')
          .where('article_id', articleId)
          .update({
            editor_id: editorId, // Gán bài viết cho Editor duyệt
            status: 'waiting'   // Cập nhật trạng thái bài viết thành "waiting"
          });
      }      

};
