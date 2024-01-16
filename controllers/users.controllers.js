const { retrieveAllUsers } = require("../models/users.models")

exports.getAllUsers = (req, res, next) => {
  retrieveAllUsers().then((users) => {
    res.status(200).send({users})
  })
}