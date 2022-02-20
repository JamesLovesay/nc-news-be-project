const { getCommentsByArticleId, postComment } = require('../controllers/comments-controllers')
const { getArticle, updateArticleById, getArticles, removeArticleById, postArticle } = require('../controllers/controllers');
const articlesRouter = require('express').Router();

articlesRouter
.route('/:article_id')
.get(getArticle)
.patch(updateArticleById)
.delete(removeArticleById)

articlesRouter
.route('/')
.get(getArticles)
.post(postArticle)

articlesRouter
.route('/:article_id/comments')
.get(getCommentsByArticleId)
.post(postComment)

module.exports = articlesRouter;