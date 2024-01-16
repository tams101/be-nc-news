const db = require("../db/connection");

exports.retrieveArticleById = (article_id) => {
  return db
    .query(
      `
    SELECT * FROM articles 
    WHERE article_id = $1
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

exports.retrieveAllArticles = () => {
  const promiseOne = db.query(
    "SELECT articles.author, articles.title, articles.article_id, articles.topic, articles.created_at, articles.votes, articles.votes, articles.article_img_url FROM articles ORDER BY created_at DESC"
  );
  const promiseTwo = db.query(`
  SELECT COUNT(article_id), article_id FROM comments GROUP BY article_id
  `);

  return Promise.all([promiseOne, promiseTwo]).then((result) => {
    const articles = result[0].rows;
    const comments = result[1].rows;

    articles.forEach((article) => {
      comments.forEach((commentCount) => {
        if (article.article_id === commentCount.article_id) {
          article.comment_count = +commentCount.count;
        }
      });
      if (!article.comment_count) {
        article.comment_count = 0;
      }

    });

    return articles;
  });
};

exports.updateArticleVotesById = (newVote, article_id) => {
  return db.query(`
  UPDATE articles
  SET 
  votes = votes + $1
  WHERE article_id = $2
  RETURNING *
  `, [newVote, article_id])
  .then(({rows}) => {
    if (rows.length === 0) {
      return Promise.reject({ msg: "article does not exist" });
    }
    return rows[0]
  })
}