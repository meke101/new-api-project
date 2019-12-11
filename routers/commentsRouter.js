const commentsRouter = require("express").Router();

const { methodNotAllowed } = require("../errors/errors");
// console.log(" comments router...");

commentsRouter
  .route("/")
  
  .all(methodNotAllowed);

module.exports = { commentsRouter };
