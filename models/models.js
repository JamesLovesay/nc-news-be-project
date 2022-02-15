const db = require('../db/connection.js');

exports.selectTopics = () => {
    return db.query('SELECT * FROM topics;').then(({rows}) => {
        return rows;
    })
}

exports.selectArticle = (id) => {
    return db.query('SELECT * FROM articles WHERE article_id = $1', [id]).then(({ rows }) => {
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
    return db.query('UPDATE articles SET votes = votes + $1 WHERE article_id = $2 RETURNING *', [inc_votes, articleId])
    .then(({rows}) => {
        if(rows.length === 0) {
            return Promise.reject({status: 404, msg: "article not found"});
        }
        return rows[0];
    })
}
}

exports.selectArticles = () => {
    return db.query('SELECT * FROM articles ORDER BY created_at DESC;').then(({rows}) => {
        return rows
    })
}