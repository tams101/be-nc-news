const {
  retrieveArticleById,
  retrieveAllArticles,
  updateArticleVotesById,
  addNewArticle,
  removeArticleById,
} = require("../models/articles.models");
const {
  checkTopicExists,
  checkAuthorExists,
} = require("../utils/check-exists");

exports.getArticleById = (req, res, next) => {
  const { article_id } = req.params;
  retrieveArticleById(article_id)
    .then((article) => {
      res.status(200).send({ article });
    })
    .catch((err) => {
      next(err);
    });
};

exports.getAllArticles = (req, res, next) => {
  const { topic, sort_by, order, author, limit, p, comment_count } = req.query;

  const fetchArticlesQuery = retrieveAllArticles(
    topic,
    sort_by,
    order,
    author,
    limit,
    p,
    comment_count
  );

  const queries = [fetchArticlesQuery];

  if (topic) {
    const topicExistenceQuery = checkTopicExists(topic);
    queries.push(topicExistenceQuery);
  }

  if (author) {
    const authorExistenceQuery = checkAuthorExists(author);
    queries.push(authorExistenceQuery);
  }

  Promise.all(queries)
    .then((response) => {
        res.status(200).send(response[0]);
      
    })
    .catch((err) => {
      next(err);
    });
};

exports.patchArticleVotesById = (req, res, next) => {
  const { article_id } = req.params;
  const newVote = req.body.inc_votes;
  updateArticleVotesById(newVote, article_id)
    .then((updatedArticle) => {
      res.status(200).send({ article: updatedArticle });
    })
    .catch((err) => {
      next(err);
    });
};

exports.postNewArticle = (req, res, next) => {
  const article = req.body;
  addNewArticle(article)
    .then((newArticle) => {
      res.status(201).send({ article: newArticle });
    })
    .catch((err) => {
      next(err);
    });
};

exports.deleteArticleById = (req, res, next) => {
  const { article_id } = req.params;
  removeArticleById(article_id)
    .then(() => {
      res.status(204).send();
    })
    .catch((err) => {
      next(err);
    });
};
