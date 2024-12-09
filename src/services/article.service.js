import db from '../config/db.js'

export default {
    // Lấy tất cả các articles
    findAllArticles() {
      return db('articles')
        .select(
          'articles.article_id', 
          'articles.title', 
          'articles.abstract', 
          'articles.thumbnail', 
          'articles.views', 
          'articles.status', 
          'articles.published_date', 
          'articles.is_premium',
          'categories.category_name',
          'writers.name as writer_name',
          'editors.name as editor_name'
        )
        .leftJoin('categories', 'articles.category_id', 'categories.category_id')
        .leftJoin('users as writers', 'articles.writer_id', 'writers.user_id')
        .leftJoin('users as editors', 'articles.editor_id', 'editors.user_id')
        .orderBy('articles.published_date', 'desc');
    },
  
    // Lấy các articles by category cho sections cụ thể, bao gồm subcategories
    findArticlesByCategoryIncludingSubcategories(categoryId) {
      const mainCategoryArticles = db('articles')
        .where('articles.category_id', categoryId)
        .select(
          'article_id', 
          'title', 
          'abstract', 
          'thumbnail', 
          'views', 
          'status', 
          'published_date', 
          'is_premium'
        );
  
      const subcategoryArticles = db('articles')
        .whereIn('articles.category_id', function () {
          this.select('category_id')
            .from('categories')
            .where('belong_to', categoryId);
        })
        .select(
          'article_id', 
          'title', 
          'abstract', 
          'thumbnail', 
          'views', 
          'status', 
          'published_date', 
          'is_premium'
        );
  
      return mainCategoryArticles.union(subcategoryArticles).orderBy('published_date', 'desc');
    },
  
    // Lấy một article cụ thể by ID
    findArticleById(id) {
      return db('articles')
        .where('articles.article_id', id)
        .first()
        .leftJoin('categories', 'articles.category_id', 'categories.category_id')
        .leftJoin('users as writers', 'articles.writer_id', 'writers.user_id')
        .leftJoin('users as editors', 'articles.editor_id', 'editors.user_id')
        .select(
          'articles.*', 
          'categories.category_name',
          'writers.name as writer_name',
          'editors.name as editor_name'
        );
    },
  
    // Thêm article (entity: { title, content, abstract, thumbnail, category_id, writer_id, editor_id, status, is_premium, published_date })
    addArticle(entity) {
      return db('articles').insert(entity);
    },
  
    // Xóa article by ID
    deleteArticle(id) {
      return db('articles').where('article_id', id).del();
    },
  
    // Cập nhật article (patch method) theo ID
    updateArticle(id, entity) {
      return db('articles').where('article_id', id).update(entity);
    },
  
    // Cập nhật article status (e.g., to "published", "archived", etc.)
    updateArticleStatus(id, status) {
      return db('articles').where('article_id', id).update({ status });
    },
  
    // // Tăng 1 view khi thực hiện truy vấn? no need maybe
    // incrementArticleViews(id) {
    //   return db('articles').where('article_id', id).increment('views', 1);
    // }
};