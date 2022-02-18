const { getCommentsByArticleId, postComment } = require('../controllers/comments-controllers')
const { getArticle, updateArticleById, getArticles, } = require('../controllers/controllers');
const articlesRouter = require('express').Router();

articlesRouter
.route('/:article_id')
.get(getArticle)
.patch(updateArticleById)

articlesRouter.get('/', getArticles)

articlesRouter
.route('/:article_id/comments')
.get(getCommentsByArticleId)
.post(postComment)

module.exports = articlesRouter;