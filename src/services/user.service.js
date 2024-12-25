import bcrypt from "bcrypt";
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
				"users.password",
				"users.email",
				"users.full_name",
				db.raw("DATE_FORMAT(users.dob, '%Y-%m-%d') as dob"),
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

		return query.first().select("users.*", "categories.category_name as managed_category_name");
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

	findUsersByRole(role) {
		return db("users")
			.leftJoin("categories", "users.managed_category_id", "categories.category_id")
			.where("users.user_role", role)
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
			);
	},
	// TODO: In register, use addUser instead of this
	addReader(entity) {
		return db("users").insert(entity);
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
	
	async addOAuthUser(entity) {
		const [userId] = await db('users').insert({
			username: entity.username,
			email: entity.email,
			full_name: entity.full_name,
			user_role: entity.user_role,
			is_active: entity.is_active,
			oauth_provider: entity.oauth_provider,
			oauth_id: entity.oauth_id,
			password: null // Explicitly set NULL for OAuth users
		});
		return userId;
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

	findByEmail(email) {
		return db("users")
			.where("email", email)
			.first()
			.select("user_id", "username", "password", "email", "full_name", "dob", "user_role", "is_active", "subscription_expired_date", "premium", "managed_category_id");
	},
	findByUsername(username) {
		return db("users")
			.where("username", username)
			.first()
			.select("user_id", "username", "password", "email", "full_name", "dob", "user_role", "is_active", "subscription_expired_date", "premium", "managed_category_id");
	},
	updateUserProfile(userId, updateData) {
		const updates = {};
		if (updateData.username) updates.username = updateData.username;
		if (updateData.email) updates.email = updateData.email;
		if (updateData.full_name) updates.full_name = updateData.full_name;
		if (updateData.dob) updates.dob = new Date(updateData.dob);
		if (updateData.premium !== undefined) updates.premium = updateData.premium;
		if (updateData.subscription_expired_date !== undefined) {
			updates.subscription_expired_date = updateData.subscription_expired_date ? 
				new Date(updateData.subscription_expired_date) : 
				null;
			}
		// Hash password if provided using process.env.PASSWORD_ROUND
		if (updateData.password) {
			updates.password = bcrypt.hashSync(updateData.password, +process.env.PASSWORD_ROUND);
		}
		return db("users").where("user_id", userId).update(updates);
	},

	findAllRoles() {
		return db("users").distinct("user_role").select("user_role");
	},
	adminUpdateProfile(user_id, entity) {
		return db("users").where("user_id", user_id).update(entity);
	},

	deleteUser(userId) {
		return db("users").where("user_id", userId).update({ is_active: 0 });
	},
};
