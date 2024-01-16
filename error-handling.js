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
  if (err.code === "22P02") {
    res.status(400).send({ msg: "invalid id type" });
  } else {
    next(err);
  }

  if (err.code === "23502") {
    res.status(400).send({ msg: "bad request" });
  } else {
    next(err);
  }

  if(err.code === '23503') {
    res.status(404).send({msg: "not found"})
  }
};
