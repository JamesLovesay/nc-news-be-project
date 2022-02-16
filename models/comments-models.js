const db = require('../db/connection.js');
const { checkArticleExists } = require('./models.js');

exports.selectCommentsByArticleId = (id) => {
    return db.query('SELECT comment_id, votes, created_at, author, body FROM comments WHERE article_id = $1;', [id]).then(({ rows }) => {
        if (rows.length === 0) {
            console.log(rows)
            return checkArticleExists(id, rows)
        }
        return rows;
    })
}