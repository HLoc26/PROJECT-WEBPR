import { query } from "express";
import db from "../config/db.js";

export default {
	findUserById(id, role = null) {
		return db("users")
			.leftJoin("categories", "users.managed_category_id", "categories.category_id")
			.where("users.user_id", id)
			.modify((queryBuilder) => {
				if (role) {
					queryBuilder.andWhere("users.user_role", role);
				}
			})
			.select(
				"users.user_id",
				"users.username",
				"users.email",
				"users.full_name",
				"users.dob",
				"users.subscription_expired_date",
				"users.premium",
				"users.is_active",
				"users.user_role",
				"users.managed_category_id",
				"categories.category_name as managed_category_name"
			)
			.first();
	},

	findAllUsers(role = null) {
		let query = db("users").select("users.user_id");
		if (role) {
			query = query.where("users.user_role", role);
		}

		return query;
	},

	findUserByEmail(email, role = null) {
		let query = db("users").leftJoin("categories", "users.managed_category_id", "categories.category_id").where({ email });

		// Add role filter if specified
		if (role) {
			query = query.andWhere("user_role", role);
		}

		return query
			.first()
			.select(
				"user_id",
				"username",
				"email",
				"full_name",
				"dob",
				"subscription_expired_date",
				"premium",
				"is_active",
				"user_role",
				"managed_category_id",
				"categories.category_name as managed_category_name"
			);
	},

	findUserByUsername(username, role = null) {
		let query = db("users").leftJoin("categories", "users.managed_category_id", "categories.category_id").where({ username });

		// Add role filter if specified
		if (role) {
			query = query.andWhere("user_role", role);
		}

		return query
			.first()
			.select(
				"user_id",
				"username",
				"email",
				"full_name",
				"dob",
				"subscription_expired_date",
				"premium",
				"is_active",
				"user_role",
				"managed_category_id",
				"categories.category_name as managed_category_name"
			);
	},

	addUser(entity, role) {
		return db("users").insert({
			username: entity.username,
			password: entity.password,
			email: entity.email,
			full_name: entity.full_name,
			dob: entity.dob,
			user_role: role,
			is_active: true,
			managed_category_id: entity.managed_category_id || null,
		});
	},
	registerPremium(id, subscriptionExpiredDate) {
		return db("users").where("users.user_id", id).andWhere("users.user_role", "reader").update({
			premium: true,
			subscription_expired_date: subscriptionExpiredDate,
		});
	},

	sendArticleToEditor(articleId, editorId) {
		return db("articles").where("article_id", articleId).update({
			editor_id: editorId, // Gán bài viết cho Editor duyệt
			status: "waiting", // Cập nhật trạng thái bài viết thành "waiting"
		});
	},
};
