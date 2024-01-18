const db = require("../db/connection");

exports.retrieveAllUsers = () => {
  return db.query("SELECT * FROM users").then(({ rows }) => {
    return rows;
  });
};

exports.retrieveUserByUsername = (username) => {
  return db
    .query("SELECT * FROM users WHERE username = $1", [username])
    .then(({ rows }) => {
      if (rows.length === 0) {
        return Promise.reject({ msg: "user doesn't exist" });
      }
      return rows[0];
    });
};
