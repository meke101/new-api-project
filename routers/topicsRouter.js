const topicsRouter = require("express").Router();
const { getTopics } = require("../controllers/topicsController");
const { methodNotAllowed } = require("../errors/errors");
// console.log(" topics router...");

topicsRouter.route("/").get(getTopics).all(methodNotAllowed);

module.exports = { topicsRouter };
