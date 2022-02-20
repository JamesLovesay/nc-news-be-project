const db = require('../db/connection.js');

exports.selectTopics = () => {
    return db.query('SELECT * FROM topics;').then(({rows}) => {
        return rows;
    })
}

exports.addNewTopic = (newTopic) => {
    if(!newTopic.hasOwnProperty('slug') || !newTopic.hasOwnProperty('description') || newTopic.slug.length === 0 || newTopic.description.length === 0) {
        return Promise.reject({ status: 400, msg: 'bad request by user'})
    } else {
    return db.query('INSERT INTO topics (description, slug) VALUES ($1, $2) RETURNING *;', [newTopic.description, newTopic.slug]).then(({ rows }) => {
        return rows[0]
        })
    }
}

exports.selectArticle = (id) => {
    return db.query('SELECT articles.*, CAST(COUNT(comments.comment_id) AS INT) AS comment_count FROM articles LEFT JOIN comments ON comments.article_id = articles.article_id WHERE comments.article_id = $1 GROUP BY articles.article_id;', [id]).then(({ rows }) => {
        if (rows.length === 0) {
            return Promise.reject({status: 404, msg:"article not found"});
        }
        return rows[0];
    })
}

exports.amendArticleById = (articleId, changesToArticle) => {
    if(changesToArticle.hasOwnProperty('inc_votes') === false || typeof changesToArticle.inc_votes !== 'number') {
        return Promise.reject({status: 400, msg: "bad request by user"})
    } else {
    const { inc_votes } = changesToArticle;
    return db.query('UPDATE articles SET votes = votes + $1 WHERE article_id = $2 RETURNING *;', [inc_votes, articleId])
    .then(({rows}) => {
        if(rows.length === 0) {
            return Promise.reject({status: 404, msg: "article not found"});
        }
        return rows[0];
    })
}
}

exports.selectArticles = (sort_by = 'created_at', order = 'DESC', topic) => {
    const validSortBy = ['article_id', 'title', 'topic', 'author', 'body', 'created_at', 'votes'];
    const validOrder = ['asc', 'desc', 'ASC', 'DESC'];
    const validTopics = ['cats', 'mitch', 'paper'];

    if((topic && !validTopics.includes(topic)) || !validSortBy.includes(sort_by) || !validOrder.includes(order)) {
        if(!validSortBy.includes(sort_by) || !validOrder.includes(order)) {
            return Promise.reject({status: 400, msg: 'Invalid sort query'})
        }
        if(topic && !validTopics.includes(topic)) {
            return Promise.reject({status: 404, msg: '404 - topic not found'})
        }
    } else {
        queryValues = [];
        let queryStr = `SELECT articles.*, CAST(COUNT(comments.comment_id) AS INT) AS comment_count FROM articles LEFT JOIN comments ON comments.article_id = articles.article_id `;
        if(topic) {
            queryStr += 'WHERE topic = $1 '
            queryValues.push(topic)
        }
        queryStr += `GROUP BY articles.article_id ORDER BY ${sort_by} ${order.toUpperCase()};`
        return db.query(queryStr, queryValues)
        .then(({rows}) => {
            return rows
            })
        }
}

exports.checkArticleExists = (articleId, comments) => {
    return db.query('SELECT * FROM articles WHERE article_id = $1;', [articleId])
    .then(({ rows }) => {
        if (rows.length === 0) {
            return Promise.reject({ status: 404, msg: "404 - Article not found" })
        }
        return comments;
    })
}

exports.selectEndpointJson = () => {
    const object = require('../endpoints.json')
    return object;
}

exports.deleteArticleById = (id) => {
    return db.query('DELETE FROM articles WHERE article_id = $1;', [id])
    .then(({ rows }) => {
        return rows;
        })
}

exports.addNewArticle = (newArticle) => {
    return db.query('INSERT INTO articles (title, topic, author, body) VALUES ($1, $2, $3, $4) RETURNING *;', [newArticle.title, newArticle.topic, newArticle.author, newArticle.body])
    .then(({ rows }) => {
        return rows[0];
    })
    .then((article) => {
    return this.checkArticleExists(article.article_id)
    })
}
