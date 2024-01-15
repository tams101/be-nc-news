const express = require("express");
const {getAllTopics} = require("./controllers/topics.controllers")
const {getAllEndpoints} = require("./controllers/api.controllers")
const {invalidPath} = require("./error-handling")
const fs = require('fs/promises')
const endpoints = require('./endpoints.json')


const app = express();

app.use(express.json());

app.get('/api/topics', getAllTopics)

app.get('/api', getAllEndpoints)

app.all("*", invalidPath)

module.exports = app;
