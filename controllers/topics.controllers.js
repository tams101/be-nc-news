const {retrieveAllTopics, addNewTopic} = require('../models/topics.models')

exports.getAllTopics = (req, res, next) => {
  retrieveAllTopics().then((topics) => {
    res.status(200).send({topics})
  })
}

exports.postNewTopic = (req, res, next) => {
  const newTopic = req.body
  addNewTopic(newTopic).then((addedTopic) => {
    res.status(201).send({topic: addedTopic})
  }).catch((err) => {
    next(err)
  })
}