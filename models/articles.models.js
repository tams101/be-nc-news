const db = require("../db/connection");

exports.retrieveArticleById = (article_id) => {
  return db
    .query(
      `
    SELECT articles.*, COUNT(comments.comment_id)::INT AS comment_count FROM articles
    LEFT JOIN comments ON articles.article_id = comments.article_id 
    WHERE articles.article_id = $1
    GROUP BY articles.article_id
    ORDER BY created_at DESC
  `,
      [article_id]
    )
    .then(({ rows }) => {
      if (rows.length === 0) {
        return Promise.reject({ status: 404, msg: "article does not exist" });
      }
      return rows[0];
    });
};

exports.retrieveAllArticles = (
  topic,
  sort_by = "created_at",
  order = "desc",
  author,
  limit = 10,
  p = 1
) => {
  const validSortQueries = [
    "article_id",
    "topic",
    "author",
    "title",
    "created_at",
    "votes",
    "comment_count"
  ];

  const validOrderQueries = ["asc", "desc"];

  if (!validSortQueries.includes(sort_by)) {
    return Promise.reject({ status: 400, msg: "invalid sort_by query" });
  }

  if (!validOrderQueries.includes(order)) {
    return Promise.reject({ status: 400, msg: "invalid order query" });
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
    ORDER BY ${sort_by} ${order}
    `;

  const getArticlesCount = db.query(queryStr, queryParams);

  queryStr += ` LIMIT ${limit} OFFSET ${(p - 1) * limit}`;

  const getArticles = db.query(queryStr, queryParams);

  return Promise.all([getArticlesCount, getArticles]).then((result) => {
    const total_count = result[0].rowCount;
    const articles = result[1].rows;
    return { articles, total_count };
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
        return Promise.reject({ status: 404, msg: "article does not exist" });
      }
      return rows[0];
    });
};

exports.addNewArticle = ({
  author,
  title,
  body,
  topic,
  article_img_url = "https://www.example.com/default_img",
}) => {
  return db
    .query(
      `
  INSERT INTO articles
  (author, title, body, topic, article_img_url)
  VALUES
  ($1, $2, $3, $4, $5)
  `,
      [author, title, body, topic, article_img_url]
    )
    .then(() => {
      return db
        .query(
          `
      SELECT articles.*, COUNT (comments.comment_id)::INT AS comment_count FROM articles 
      LEFT JOIN comments ON articles.article_id = comments.article_id
      GROUP BY articles.article_id
      ORDER BY articles.created_at DESC
      LIMIT 1
      `
        )
        .then(({ rows }) => {
          return rows[0];
        });
    });
};

exports.removeArticleById = (article_id) => {
  return db
    .query(
      `DELETE FROM articles
      WHERE article_id = $1
      RETURNING *
    `,
      [article_id]
    )
    .then(({ rows }) => {
      if (rows.length === 0) {
        return Promise.reject({ status: 404, msg: "article does not exist" });
      }
      return rows;
    });
};
