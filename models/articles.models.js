const db = require("../db/connection");

exports.retrieveArticleById = (article_id) => {
  return db
    .query(
      `
    SELECT articles.*, COUNT(comments.comment_id)::INT AS comment_count FROM articles
    JOIN comments ON articles.article_id = comments.article_id 
    WHERE articles.article_id = $1
    GROUP BY articles.article_id
    ORDER BY created_at DESC
  `,
      [article_id]
    )
    .then(({ rows }) => {
      if (rows.length === 0) {
        return Promise.reject({ msg: "article does not exist" });
      }
      return rows[0];
    });
};

exports.retrieveAllArticles = (
  topic,
  sort_by = "created_at",
  order = "desc",
  author
) => {
  const validSortQueries = [
    "article_id",
    "topic",
    "author",
    "title",
    "body",
    "created_at",
    "votes",
    "article_img_url",
  ];

  const validOrderQueries = ["asc", "desc"];

  if (!validSortQueries.includes(sort_by)) {
    return Promise.reject({ msg: "invalid sort_by query" });
  }

  if (!validOrderQueries.includes(order)) {
    return Promise.reject({ msg: "invalid order query" });
  }

  let queryStr = `
  SELECT articles.author, articles.title, articles.article_id, articles.topic, articles.created_at, articles.votes, articles.article_img_url, COUNT (comments.comment_id)::INT AS comment_count FROM articles 
  LEFT JOIN comments ON articles.article_id = comments.article_id
  `;
  const queryParams = [];

  if (topic) {
    queryStr += ` WHERE topic = $1`;
    queryParams.push(topic);
  }

  if (author) {
    if (queryParams.length) {
      queryStr += " AND";
    } else {
      queryStr += " WHERE";
    }
    queryParams.push(author);
    queryStr += ` articles.author = $${queryParams.length}`;
  }

  queryStr += ` GROUP BY articles.article_id
    ORDER BY ${sort_by} ${order}`;

  return db.query(queryStr, queryParams).then(({ rows }) => {
    return rows;
  });
};

exports.updateArticleVotesById = (newVote, article_id) => {
  return db
    .query(
      `
  UPDATE articles
  SET 
  votes = votes + $1
  WHERE article_id = $2
  RETURNING *
  `,
      [newVote, article_id]
    )
    .then(({ rows }) => {
      if (rows.length === 0) {
        return Promise.reject({ msg: "article does not exist" });
      }
      return rows[0];
    });
};
