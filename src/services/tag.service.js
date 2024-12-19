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

  // Thêm các tags cho một bài viết cụ thể
  addTagsToArticle(articleId, tagIds) {
    const articleTags = tagIds.map(tagId => ({
      article_id: articleId,
      tag_id: tagId
    }));
    return db('articletags').insert(articleTags);
  },

  // Xóa tất cả các tags của một bài viết cụ thể
  removeTagsFromArticle(articleId) {
    return db('articletags').where('article_id', articleId).del();
  },

  // Xóa một tag cụ thể
  deleteTag(tagId) {
    return db('tags').where('tag_id', tagId).del();
  },

  // Cập nhật tên của một tag cụ thể
  updateTag(tagId, tagName) {
    return db('tags').where('tag_id', tagId).update({ tag_name: tagName });
  }
};