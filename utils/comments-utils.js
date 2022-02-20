const db = require('../db/connection.js');

exports.checkCommentExists = (id) => {
    return db.query('SELECT * FROM comments WHERE comment_id = $1;', [id])
    .then(({ rows }) => {
        if (rows.length === 0) {
            return Promise.reject({ status: 404, msg: "404 - Comment not found"})
        }
        return rows;
    })
}