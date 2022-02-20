const { removeCommentById, updateCommentById } = require('../controllers/comments-controllers');
const commentsRouter = require('express').Router();

commentsRouter
.route('/:comment_id')
.delete(removeCommentById)
.patch(updateCommentById)

module.exports = commentsRouter;