const {retrieveAllTopics, retrieveAllEndpoints} = require('../models/topics.models')

exports.getAllTopics = (req, res, next) => {
  retrieveAllTopics().then((topics) => {
    res.status(200).send({topics})
  })
}

