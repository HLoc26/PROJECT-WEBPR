import categoryService from "../services/category.service.js";

const ITEMS_PER_PAGE = 10; // Số bài viết trên mỗi trang

export const getCategoryArticles = async (req, res) => {
    try {
        const categoryId = req.query.id;
        const page = parseInt(req.query.page) || 1;

        if (!categoryId) {
            return res.status(400).render('../views/vwError/404.ejs');
        }

        // Lấy thông tin category
        const category = await categoryService.findCategoryById(categoryId);

        

        if (!category) {
            return res.status(404).render('../views/vwError/404.ejs');
        }

        // Lấy bài viết
        const result = await categoryService.findCategoryWithArticles(categoryId, page, ITEMS_PER_PAGE);

        console.log('Articles:', result.articles); // Debug ở đây
        console.log('Total Pages:', result.totalPages); // Kiểm tra tổng số trang

        if (!result) {
            return res.status(404).render('../views/vwError/404.ejs');
        }

        const { articles, totalPages } = result;

        // Truyền category vào view
        res.render('../views/vwArticle/List.ejs', {
            category,
            articles,
            currentPage: page,
            totalPages,
            categoryId,
        });
    } catch (err) {
        console.error(err);
        res.status(500).render('../views/vwError/500.ejs');
    }
};

