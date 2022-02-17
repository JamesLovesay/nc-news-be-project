const { selectCommentsByArticleId } = require('../models/comments-models')
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