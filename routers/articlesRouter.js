const articlesRouter = require("express").Router();
const {
  getArticle,
  patchArticle,
  postComment
} = require("../controllers/articlesController");
const { methodNotAllowed } = require("../errors/errors");
console.log(" articles router...");

articlesRouter
  .route("/:article_id")
  .get(getArticle)
  .patch(patchArticle)
  .all(methodNotAllowed);

articlesRouter
  .route("/:article_id/comments")
  .post(postComment)
  .all(methodNotAllowed);

module.exports = { articlesRouter };
