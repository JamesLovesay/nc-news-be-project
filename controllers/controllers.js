const { selectTopics, selectArticle } = require('../models/models')

exports.getTopics = (req, res, next) => {
    selectTopics().then((topics) => {
        res.status(200).send({topics})
    })
    .catch((err) => {
        next(err)
    })
}

exports.getArticle = (req, res, next) => {
    const articleID  = req.params.article_id;
    selectArticle(articleID).then((article) => {
        res.status(200).send({article});
    })
    .catch((error) => {
        next(error);
    })

}
