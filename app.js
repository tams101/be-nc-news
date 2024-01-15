const express = require("express");
const {getAllTopics} = require("./controllers/topics.controllers")
const {getAllEndpoints} = require("./controllers/api.controllers")
const {invalidPath, idNotFound, invalidId} = require("./error-handling")
const {getArticleById} = require("./controllers/articles.controller")

const app = express();

app.get('/api/topics', getAllTopics)

app.get('/api', getAllEndpoints)

app.get('/api/articles/:article_id', getArticleById)

app.all("*", invalidPath)

//Error handling
app.use(idNotFound)

app.use(invalidId)

module.exports = app;
