const { getAllTopics, postNewTopic } = require("../controllers/topics.controllers");

const topicsRouter = require("express").Router();

topicsRouter.route("/").
get(getAllTopics)
.post(postNewTopic);

module.exports = topicsRouter;
