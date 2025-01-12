import categoryService from "../services/category.service.js";

export default {
	async getCategories(req, res) {
		try {
			res.render("vwAdmin/category.list.ejs", { layout: "layouts/admin.main.ejs" });
		} catch (error) {
			console.error("Error fetching categories:", error);
			return res.status(500).redirect("/500");
		}
	},

	async getAddCategories(req, res) {
		try {
			res.render("vwAdmin/category.add.ejs", { layout: "layouts/admin.main.ejs" });
		} catch (error) {
			console.error("Error from getAddCategories:", error);
			return res.status(500).redirect("/500");
		}
	},

	async addCategories(req, res) {
		const category = {
			category_name: req.body.category_name,
			description: req.body.description,
			belong_to: req.body.belong_to || null,
		};
		try {
			const ret = await categoryService.addCategory(category);
			return res.redirect("/admin/categories");
		} catch (error) {
			console.error("Error from addCategories:", error);
			return res.status(500).redirect("/500");
		}
	},

	async getEditCategories(req, res) {
		try {
			const id = +req.query.id || 0;
			const data = await categoryService.findCategoryById(id);
			if (!data) {
				return res.redirect("/admin/categories");
			}

			res.render("vwAdmin/category.edit.ejs", {
				category: data,
				layout: "layouts/admin.main.ejs",
			});
		} catch (error) {
			console.error("Error from getEditCategories:", error);
			return res.status(500).redirect("/500");
		}
	},

	async editCategories(req, res) {
		try {
			const id = req.body.CatID;
			const changes = {
				category_name: req.body.CatName,
				description: req.body.Description,
				belong_to: req.body.BelongTo,
			};
			await categoryService.patchCategory(id, changes);

			res.redirect(`/admin/categories/edit?id=${id}`);
		} catch (error) {
			console.error("Error from editCategories:", error);
			return res.status(500).redirect("/500");
		}
	},
};
