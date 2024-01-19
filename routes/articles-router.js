const {
  getAllArticles,
  getArticleById,
  patchArticleVotesById,
  postNewArticle
} = require("../controllers/articles.controller");
const {
  getCommentsByArticleId,
  postNewComment,
} = require("../controllers/comments.controller");

const articlesRouter = require("express").Router();

articlesRouter.route("/")
.get(getAllArticles)
.post(postNewArticle)

articlesRouter
  .route("/:article_id")
  .get(getArticleById)
  .patch(patchArticleVotesById);

articlesRouter
  .route("/:article_id/comments")
  .get(getCommentsByArticleId)
  .post(postNewComment);

module.exports = articlesRouter;
