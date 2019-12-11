const usersRouter = require("express").Router();
const { getUser } = require("../controllers/usersController");
const { methodNotAllowed } = require("../errors/errors");

// console.log(" users router...");

usersRouter
  .route("/:username")
  .get(getUser)
  .all(methodNotAllowed);

module.exports = { usersRouter };
