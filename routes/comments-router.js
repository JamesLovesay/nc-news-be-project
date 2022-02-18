const { removeCommentById } = require('../controllers/comments-controllers');
const commentsRouter = require('express').Router();

commentsRouter.delete('/:comment_id', removeCommentById)

module.exports = commentsRouter;