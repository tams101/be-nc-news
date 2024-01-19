const db = require("../db/connection");

exports.retrieveCommentsByArticleId = (article_id) => {
  return db
    .query(
      "SELECT * FROM comments  WHERE article_id = $1 ORDER BY created_at DESC ",
      [article_id]
    )
    .then(({ rows }) => {
      return rows;
    });
};

exports.addNewCommentByArticleId = (article_id, { username, body }) => {
  return db
    .query(
      `
  INSERT INTO comments (article_id, author, body)
  VALUES ($1, $2, $3)
  RETURNING *
  `,
      [article_id, username, body]
    )
    .then(({ rows }) => {
      return rows[0];
    });
};

exports.removeCommentById = (comment_id) => {
  return db
    .query(
      `
    DELETE FROM comments WHERE comment_id = $1
    RETURNING *
  `,
      [comment_id]
    )
    .then(({ rows }) => {
      if (rows.length === 0) {
        return Promise.reject({ status: 404, msg:"comment does not exist" });
      }
    });
};

exports.updateCommentVotesById = (newVotes, comment_id) => {
  return db
    .query(
      `
  UPDATE comments
  SET
  votes = votes + $1
  WHERE comment_id = $2
  RETURNING *
  `,
      [newVotes, comment_id]
    )
    .then(({ rows }) => {
      if (rows.length === 0) {
        return Promise.reject({ status: 404, msg: "comment_id not found" });
      }
      return rows[0];
    });
};
