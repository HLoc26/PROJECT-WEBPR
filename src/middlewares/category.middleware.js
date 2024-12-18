import CategoryService from "../services/category.service.js";

const setCategories = async function (req, res, next) {
	try {
		// Lấy danh sách tất cả các chuyên mục cấp 1 (parent)
		const parentCategories = await CategoryService.findAllCategories().where("belong_to", null);

		// Thêm các chuyên mục con (subcategories) vào từng chuyên mục cha
		const categoriesWithSubcategories = await Promise.all(
			parentCategories.map(async function (category) {
				const subcategories = await CategoryService.findSubcategories(category.category_id);
				return {
					...category,
					subcategories,
				};
			})
		);

		// Set biến categories để sử dụng trong các view
		res.locals.categories = categoriesWithSubcategories;
		next();
	} catch (error) {
		console.error(error);
		next(error);
	}
};

export default setCategories;
