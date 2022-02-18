const { selectTopics, selectArticle, amendArticleById, selectArticles, selectEndpointJson } = require('../models/models')

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
    const { sort_by, order, topic } = req.query
    selectArticles(sort_by, order, topic).then((articles) => {
        res.status(200).send({articles})
    })
    .catch((err) => {
        next(err)
    })
}

exports.getEndpointJson = (req, res, next) => {
    const object = selectEndpointJson();
    res.status(200).send({ object })

}
