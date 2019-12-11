const express = require("express");
const app = express();
const { apiRouter } = require("./routers/apiRouter");
const {
  methodNotAllowed,
  handleCustomErrors,
  handlePsqlErrors
} = require("./errors/errors");

app.use(express.json());
app.use("/api", apiRouter);

app.use(methodNotAllowed);
app.use(handleCustomErrors);
app.use(handlePsqlErrors);
module.exports = app;
