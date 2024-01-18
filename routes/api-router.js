const { getAllEndpoints } = require("../controllers/api.controllers");

const apiRouter = require("express").Router();

apiRouter.get("/", getAllEndpoints);

module.exports = apiRouter;
