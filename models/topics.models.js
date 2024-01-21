const db = require("../db/connection");

exports.retrieveAllTopics = () => {
  return db.query("SELECT * FROM topics").then(({ rows }) => {
    return rows;
  });
};

exports.addNewTopic = ({ description, slug }) => {
  return db
    .query(
      `
    INSERT INTO topics
    (description, slug)
    VALUES 
    ($1, $2)
    RETURNING *
  `,
      [description, slug]
    )
    .then(({ rows }) => {
      return rows[0];
    });
};
