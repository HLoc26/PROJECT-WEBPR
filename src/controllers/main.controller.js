import { getNews } from "./news.controller.js";
export const getHomepage = function (req, res) {
	res.send(`Hello from main.controller.js<br><a href="/news">Go to news</a>`);
};

export default {
	getHomepage,
	getNews,
};
