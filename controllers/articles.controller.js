const {retrieveArticleById, retrieveAllArticles} = require('../models/articles.models')

exports.getArticleById = (req, res, next) => {
  const {article_id} = req.params
  retrieveArticleById(article_id).then((article) => {
    res.status(200).send({article})
  })
  .catch((err) => {
    next(err)
  })
}

exports.getAllArticles = (req, res, next) => {
  retrieveAllArticles().then((articles) => {
    res.status(200).send({articles})
  })
}