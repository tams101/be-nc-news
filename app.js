const express = require("express");
const cors = require("cors")
const {
  invalidPath,
  psqlError,
  internalServerError,
  customError,
} = require("./error-handling");

const apiRouter = require("./routes/api-router");
const articlesRouter = require("./routes/articles-router");
const commentsRouter = require("./routes/comments-router");
const topicsRouter = require("./routes/topics-router");
const usersRouter = require("./routes/users-router");

const app = express();

app.use(cors())

app.use(express.json());

app.use("/api/topics", topicsRouter);

app.use("/api", apiRouter);

app.use("/api/articles", articlesRouter);

app.use("/api/comments", commentsRouter);

app.use("/api/users", usersRouter);

app.all("*", invalidPath);

//Error handling
app.use(customError);

app.use(psqlError);

app.use(internalServerError);

module.exports = app;
