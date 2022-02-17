const express = require('express');
const app = express();
const { getTopics, getArticle, updateArticleById, getArticles } = require('./controllers/controllers')
const { getUsers } = require('./controllers/user-controllers')
const { getCommentsByArticleId } = require('./controllers/comments-controllers.js')
app.use(express.json());

app.get('/api/topics', getTopics);
app.get('/api/articles/:article_id', getArticle);
app.patch('/api/articles/:article_id', updateArticleById);
app.get('/api/users', getUsers)
app.get('/api/articles', getArticles)
app.get('/api/articles/:article_id/comments', getCommentsByArticleId)


app.all('/*', (req, res) => {
    res.status(404).send({ msg: '404 - Path not found'})
})

app.use((err, req, res, next) => {
    console.log(err)
    if(err.status && err.msg) {
        res.status(err.status).send({ msg: err.msg })
    } else next(err);
});
app.use((err, req, res, next) => {
    if(err.code === "22P02") {
        res.status(400).send({msg: "bad request"});
    } else next(err);
});
app.use((err, req, res, next) => {
    res.status(500).send({msg: 'Internal Server Error' })
});

module.exports = app;