exports.methodNotAllowed = (req, res, next) => {
  res.status(405).send({ msg: "method not found" });
};

exports.handleCustomErrors = (err, req, res, next) => {
  // console.log(err.code);
  if (err.status) {
    res.status(err.status).send({ msg: err.msg });
  } else next(err);
};

exports.handlePsqlErrors = (err, req, res, next) => {
  const psqlCodes = {
    "23502": { status: 400, msg: "Bad request" },
    "22P02": { status: 400, msg: "Bad request" },
    "23503": { status: 404, msg: "Not Found" },
    "42703": { status: 400, msg: "Bad Insert Request" }
  };
  const currentError = psqlCodes[err.code];
  if (currentError) {
    res.status(currentError.status).send({ msg: currentError.msg });
  } else next(err);
};
