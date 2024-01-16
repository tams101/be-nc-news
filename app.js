const express = require("express");
const { getAllTopics } = require("./controllers/topics.controllers");
const { getAllEndpoints } = require("./controllers/api.controllers");
const { invalidPath, idNotFound, psqlError } = require("./error-handling");
const {
  getArticleById,
  getAllArticles,
  patchArticleVotesById,
} = require("./controllers/articles.controller");
const {
  getCommentsByArticleId,
  postNewComment,
  deleteCommentById,
} = require("./controllers/comments.controller");

const app = express();

app.use(express.json());

app.get("/api/topics", getAllTopics);

app.get("/api", getAllEndpoints);

app.get("/api/articles/:article_id", getArticleById);

app.get("/api/articles", getAllArticles);

app.get("/api/articles/:article_id/comments", getCommentsByArticleId);

app.post("/api/articles/:article_id/comments", postNewComment);

app.patch("/api/articles/:article_id", patchArticleVotesById);

app.delete("/api/comments/:comment_id", deleteCommentById);

app.all("*", invalidPath);

//Error handling
app.use(idNotFound);

app.use(psqlError);

module.exports = app;
