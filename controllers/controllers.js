const { selectTopics, selectArticle, amendArticleById, selectArticles } = require('../models/models')

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

exports.updateArticleById = (req, res, next) => {

    const articleId = req.params.article_id;
    const changesToArticle = req.body;
    amendArticleById(articleId, changesToArticle).then((updatedArticle) => {
        res.status(200).send({updatedArticle})
    })
    .catch((error) => {
        next(error)
    })
}

exports.getArticles = (req, res, next) => {
    selectArticles().then((articles) => {
        res.status(200).send({articles})
    })
}
