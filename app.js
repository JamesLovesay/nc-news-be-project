const express = require('express');
const app = express();
const { getTopics, getArticle } = require('./controllers/controllers')

app.use(express.json());

app.get('/api/topics', getTopics);


app.all('/*', (req, res) => {
    res.status(404).send({ msg: '404 - Path not found'})
})

module.exports = app;