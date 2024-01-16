const {
  retrieveCommentsByArticleId,
  addNewCommentByArticleId,
} = require("../models/comments.models");
const { checkArticleExists } = require("../utils/check-exists");

exports.getCommentsByArticleId = (req, res, next) => {
  const { article_id } = req.params;

  const articleExistenceQuery = checkArticleExists(article_id);
  const fetchCommentsQuery = retrieveCommentsByArticleId(article_id);

  Promise.all([fetchCommentsQuery, articleExistenceQuery])
    .then((response) => {
      const comments = response[0];
      res.status(200).send({ comments });
    })
    .catch((err) => {
      next(err);
    });
};

exports.postNewComment = (req, res, next) => {
  const { article_id } = req.params;
  const newComment = req.body;

  addNewCommentByArticleId(article_id, newComment)
    .then((addedComment) => {
      res.status(201).send({ comment: addedComment });
    })
    .catch((err) => {
      next(err);
    });
};
