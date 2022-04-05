const { selectCommentsByArticleId, addNewComment, deleteCommentById, amendCommentById } = require('../models/comments-models')
const { checkArticleExists } = require('../models/models')
const { checkCommentExists } = require('../utils/comments-utils.js')

exports.getCommentsByArticleId = (req, res, next) => {
    const { article_id: articleId } = req.params;
    const { limit, p } = req.query;
    Promise.all([selectCommentsByArticleId(articleId, limit, p), checkArticleExists(articleId)])
    .then(([comments]) => {
        res.status(200).send({comments})
    })
    .catch((err) => {
        next(err)
    })
}

exports.postComment = (req, res, next) => {
    const { article_id: articleId } = req.params;
    addNewComment(articleId, req.body).then((comment) => {
        res.status(201).send({ comment })
    })
    .catch((err) => {
        next(err);
    })
}

exports.removeCommentById = (req, res, next) => {
    const { comment_id: id } = req.params;
    Promise.all([deleteCommentById(id), checkCommentExists(id)])
    .then(([response]) => {
        res.status(204).send({ response })
    })
    .catch((error) => {
        next(error)
    })
}

exports.updateCommentById = (req, res, next) => {
    const commentId = req.params.comment_id;
    const changesToComment = req.body;
    amendCommentById(commentId, changesToComment).then((comment) => {
        res.status(200).send({ comment })
    })
    .catch((err) => {
        next(err)
    })
}