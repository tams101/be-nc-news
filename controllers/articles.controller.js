const {
  retrieveArticleById,
  retrieveAllArticles,
  updateArticleVotesById,
} = require("../models/articles.models");

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
  retrieveAllArticles().then((articles) => {
    res.status(200).send({ articles });
  });
};

exports.patchArticleVotesById = (req, res, next) => {
  const { article_id } = req.params;
  const newVote = req.body.inc_votes;
  updateArticleVotesById(newVote, article_id).then((updatedArticle) => {
    res.status(200).send({article: updatedArticle})
  })
  .catch((err) => {
    next(err)
  })
};
