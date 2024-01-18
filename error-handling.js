exports.invalidPath = (req, res) => {
  res.status(404).send({ msg: "path doesn't exist" });
};

exports.idNotFound = (err, req, res, next) => {
  if (err.msg) {
    res.status(404).send({ msg: err.msg });
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
  } else {
    next(err);
  }
};

exports.internalServerError = (err, req, res, next) => {
  res.status(500).send({ msg: "internal server error" });
};
