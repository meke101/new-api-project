const articlesRouter = require("express").Router();
const {
  getArticle,
  patchArticle,
  postComment,
  getComments,
  getArticles
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
  .get(getComments)
  .all(methodNotAllowed);

articlesRouter
  .route("/")
  .get(getArticles)
  .all(methodNotAllowed);

module.exports = { articlesRouter };
