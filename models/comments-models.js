const db = require('../db/connection.js');
const { checkArticleExists } = require('./models.js');

exports.selectCommentsByArticleId = (id) => {
    return db.query('SELECT comment_id, votes, created_at, author, body FROM comments WHERE article_id = $1;', [id]).then(({ rows }) => {
        if (rows.length === 0) {
            return checkArticleExists(id, rows)
        }
        return rows;
    })
}

exports.addNewComment = (id, newComment) => {
    if(!newComment.hasOwnProperty('username') || !newComment.hasOwnProperty('body') || newComment.body.length === 0) {
        return Promise.reject({status: 400, msg: 'bad request by user'})
    } else {
    return db.query(`INSERT INTO comments (body, article_id, author, votes) VALUES ($1, $2, $3, 0) RETURNING *;`, [newComment.body, id, newComment.username]).then(({rows}) => {
        return rows[0];
    })
    }
}