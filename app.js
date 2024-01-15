const express = require("express");
const {getAllTopics} = require("./controllers/topics.controllers")
const {invalidPath} = require("./error-handling")

const app = express();

app.use(express.json());

app.get('/api/topics', getAllTopics)

app.all("*", invalidPath)

module.exports = app;
