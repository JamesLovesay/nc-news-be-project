const { selectCommentsByArticleId, addNewComment, deleteCommentById } = require('../models/comments-models')
const { checkArticleExists } = require('../models/models')

exports.getCommentsByArticleId = (req, res, next) => {
    const { article_id: articleId } = req.params;
    Promise.all([selectCommentsByArticleId(articleId), checkArticleExists(articleId)])
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
    deleteCommentById(id).then((response) => {
        res.status(204).send({ response })
    })
    .catch((error) => {
        next(error)
    })
}