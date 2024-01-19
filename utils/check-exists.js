const db = require("../db/connection");

exports.checkArticleExists = (article_id) => {
  return db
    .query("SELECT * FROM articles WHERE article_id = $1", [article_id])
    .then(({ rows }) => {
      if (rows.length === 0) {
        return Promise.reject({ status: 404, msg: "article not found" });
      }
    });
};

exports.checkTopicExists = (topic) => {
  return db
    .query(`SELECT * FROM topics WHERE slug = $1`, [topic])
    .then(({ rows }) => {
      if (rows.length === 0) {
        return Promise.reject({ status: 404, msg: "topic not found" });
      }
    });
};

exports.checkAuthorExists = (author) => {
  return db.query("SELECT * FROM users WHERE username = $1", [author])
  .then(({rows}) => {
    if (rows.length === 0) {
      return Promise.reject({status: 404, msg: "author not found"})
    }
  })
}