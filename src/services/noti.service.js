import db from "../config/db.js";

export default {
	getNotification(receiverId) {
		return db("notifications")
			.where("receiver_id", receiverId)
			.select("not_id", "sender_id", "receiver_id", "note_content", db.raw("DATE_FORMAT(created_at, '%Y-%m-%d %H:%i:%s') as created_at"))
			.orderBy("created_at", "desc");
	},

	createNotification(senderId, receiverId, noteContent) {
		return db("notifications").insert({
			sender_id: senderId,
			receiver_id: receiverId,
			note_content: noteContent,
			created_at: new Date(),
		});
	},
	getApprovalHistory(writerId) {
		return db("approvalhistories")
			.join("articles", "approvalhistories.article_id", "articles.article_id")
			.join("users as editors", "approvalhistories.editor_id", "editors.user_id")
			.where("articles.writer_id", writerId) // Filter by writer's articles
			.select(
				"approvalhistories.note_content",
				"approvalhistories.approval_date",
				"approvalhistories.article_id",
				"articles.status as article_status",
				"articles.title as article_title", // Fetch article title
				"editors.full_name as editor_name" // Fetch editor's name
			)
			.orderBy("approvalhistories.approval_date", "desc");
	},
};
