const { selectTopics, selectArticle, amendArticleById, selectArticles, selectEndpointJson, deleteArticleById, checkArticleExists, addNewArticle, addNewTopic } = require('../models/models')

exports.getTopics = (req, res, next) => {
    selectTopics().then((topics) => {
        res.status(200).send({topics})
    })
    .catch((err) => {
        next(err)
    })
}

exports.postTopic = (req, res, next) => {
    const newTopic = req.body;
    addNewTopic(newTopic).then((topic) => {
        res.status(201).send({ topic })
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

exports.removeArticleById = (req, res, next) => {
    const { article_id: id } = req.params;
    Promise.all([deleteArticleById(id), checkArticleExists(id)])
    .then(([response]) => {
        res.status(204).send({ response })
    })
    .catch((err) => {
        next(err);
    })
}

exports.postArticle = (req, res, next) => {
    const newArticle = req.body;
    addNewArticle(newArticle)
    .then((article) => {
        res.status(201).send({ article })
    })
    .catch((err) => {
        next(err)
    })
}