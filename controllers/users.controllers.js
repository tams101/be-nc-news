const {
  retrieveAllUsers,
  retrieveUserByUsername,
} = require("../models/users.models");

exports.getAllUsers = (req, res, next) => {
  retrieveAllUsers().then((users) => {
    res.status(200).send({ users });
  });
};

exports.getUserByUsername = (req, res, next) => {
  const { username } = req.params;
  retrieveUserByUsername(username)
    .then((user) => {
      res.status(200).send({ user });
    })
    .catch((err) => {
      next(err);
    });
};
