const db = require("../db/connection")

exports.retrieveCommentsByArticleId = (article_id) => {
  return db.query('SELECT * FROM comments  WHERE article_id = $1 ORDER BY created_at DESC ', [article_id])
  .then(({rows}) => {
    if(rows.length === 0) {
      return Promise.reject({msg: 'article does not exist'})
    }
    return rows
  })
}