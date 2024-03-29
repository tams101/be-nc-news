exports.invalidPath = (req, res) => {
  res.status(404).send({ msg: "path doesn't exist" });
};

exports.customError = (err, req, res, next) => {
  if (err.status && err.msg) {
    res.status(err.status).send({ msg: err.msg });
  } else {
    next(err);
  }
};

exports.psqlError = (err, req, res, next) => {
  if (err.code === "22P02" || err.code === "23502") {
    res.status(400).send({ msg: "bad request" });
  }

  if (err.code === "23503") {
    res.status(404).send({ msg: "not found" });
  } 
  
  if(err.code === "42703") {
    res.status(400).send({msg: "invalid input - must be a positive number"})
  }

  if(err.code === "23505") {
    res.status(409).send({msg: "This already exists in the database"})
  }
  
  else {
    next(err);
  }
};

exports.internalServerError = (err, req, res, next) => {
  res.status(500).send({ msg: "internal server error" });
};
