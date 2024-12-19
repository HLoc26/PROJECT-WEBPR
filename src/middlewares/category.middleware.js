import apiClient from "../config/axios.js";

export default async function setCategories(req, res, next) {
	try {
		const response = await apiClient.get("/api/categories");
		// Set biến categories để sử dụng trong các view
		res.locals.categories = response.data;
		// console.log(response.data);
		next();
	} catch (error) {
		console.error(error);
		next(error);
	}
}
