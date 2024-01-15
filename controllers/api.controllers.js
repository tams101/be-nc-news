const { retrieveAllEndpoints} = require('../models/api.models')

exports.getAllEndpoints = (req, res, next) => {
  retrieveAllEndpoints().then((endpoints) => {
    res.status(200).send({endpoints})
  })
}

