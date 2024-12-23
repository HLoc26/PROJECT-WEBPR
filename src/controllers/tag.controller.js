import TagService from "../services/tag.service.js";

const ITEMS_PER_PAGE = 10; // Số bài viết trên mỗi trang

export default {
	// Hiển thị danh sách bài viết theo tag
	async getArticlesByTag(req, res) {
		try {
			const tagId = req.query.id;
			const page = parseInt(req.query.page) || 1;

			// Kiểm tra tag có tồn tại không
			const tag = await TagService.findTagById(tagId);
			if (!tag) {
				return res.status(404).render("vwError/404", { message: "Tag not found" });
			}

			// Lấy danh sách bài viết theo tag
			const result = await TagService.findArticlesByTag(tagId, page, ITEMS_PER_PAGE);

			const { articles, totalPages } = result;

			// Truyền tag và bài viết vào view
			res.render("../views/vwHomepage/List_byTag.ejs", {
				tag,
				articles,
				currentPage: page,
				totalPages,
				tagId,
			});
		} catch (error) {
			console.error("Error in getArticlesByTag:", error);
			res.status(500).render("vwError/500", { message: "Internal Server Error" });
		}
	},

	// Display all tags
    async getAllTags(req, res) {
        try {
            const tags = await TagService.findAllTags();
            res.render("../views/vwAdmin/Tags.ejs", { tags });
        } catch (error) {
            console.error("Error in getAllTags:", error);
            res.status(500).render("vwError/500", { message: "Internal Server Error" });
        }
    },

    // Display tag details by ID
    async getTagById(req, res) {
        try {
            const tagId = req.params.id;
            const tag = await TagService.findTagById(tagId);
            if (!tag) {
                return res.status(404).render("vwError/404", { message: "Tag not found" });
            }
            res.render("../views/vwAdmin/TagDetails.ejs", { tag });
        } catch (error) {
            console.error("Error in getTagById:", error);
            res.status(500).render("vwError/500", { message: "Internal Server Error" });
        }
    },

    // Add a new tag
    async addTag(req, res) {
        try {
            const { tagName } = req.body;
            if (!tagName) {
                return res.status(400).render("vwError/400", { message: "Tag name is required" });
            }
            await TagService.addTag(tagName);
            res.redirect("/admin/tags");
        } catch (error) {
            console.error("Error in addTag:", error);
            res.status(500).render("vwError/500", { message: "Internal Server Error" });
        }
    },

    // Update a tag
    async updateTag(req, res) {
        try {
            const tagId = req.params.id;
            const { tagName } = req.body;
            if (!tagName) {
                return res.status(400).render("vwError/400", { message: "Tag name is required" });
            }
            const tag = await TagService.findTagById(tagId);
            if (!tag) {
                return res.status(404).render("vwError/404", { message: "Tag not found" });
            }
            await TagService.updateTag(tagId, tagName);
            res.redirect("/admin/tags");
        } catch (error) {
            console.error("Error in updateTag:", error);
            res.status(500).render("vwError/500", { message: "Internal Server Error" });
        }
    },

};
