import articleService from "../services/article.service.js";
export async function publish(req, res, next) {
	// Update every archived articles to published
	const articles = await articleService.findByStatus("archived");
	const currentTime = new Date();
	articles.forEach(async (article) => {
		if (article.published_date < currentTime) {
			await articleService.updateArticleStatus(article.article_id, "published");
		}
	});
	next();
}
