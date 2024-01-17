const {
  retrieveArticleById,
  retrieveAllArticles,
  updateArticleVotesById,
} = require("../models/articles.models");
const { checkTopicExists } = require("../utils/check-exists");

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
  const { topic } = req.query;

  const fetchArticlesQuery = retrieveAllArticles(topic);

  const queries = [fetchArticlesQuery];

  if (topic) {
    const topicExistenceQuery = checkTopicExists(topic);
    queries.push(topicExistenceQuery);
  }

  Promise.all(queries)
    .then((response) => {
      const articles = response[0];
      res.status(200).send({ articles });
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
