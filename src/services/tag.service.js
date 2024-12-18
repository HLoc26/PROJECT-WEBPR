import db from '../config/db.js';

export default {
  // Lấy tất cả các tags
  findAllTags() {
    return db('tags').select('tag_id', 'tag_name');
  },

  // Thêm một tag mới
  addTag(tagName) {
    return db('tags').insert({ tag_name: tagName });
  },

  // Lấy tất cả các tags của một bài viết cụ thể
  findTagsByArticleId(articleId) {
    return db('tags')
      .join('articletags', 'tags.tag_id', 'articletags.tag_id')
      .where('articletags.article_id', articleId)
      .select('tags.tag_id', 'tags.tag_name');
  },

  
};