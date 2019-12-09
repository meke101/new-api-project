const {
  topicData,
  articleData,
  commentData,
  userData
} = require("../data/index.js");

const { formatDates, formatComments, makeRefObj } = require("../utils/utils");

exports.seed = function(knex) {
  return knex.migrate
    .rollback()
    .then(() => knex.migrate.latest())
    .then(() => {
      const topicsInsertions = knex("topics")
        .insert(topicData)
        .returning("*");
      const usersInsertions = knex("users")
        .insert(userData)
        .returning("*");

      return Promise.all([topicsInsertions, usersInsertions]);
    })
    .then(() => {
      const formattedArticles = formatDates(articleData);
      return knex("articles")
        .insert(formattedArticles)
        .returning("*");
    })
    .then(articleRows => {
      // console.log(articleRows);
      const articleRef = makeRefObj(articleRows);
      // console.log(articleRef)
      const formattedComments = formatComments(commentData, articleRef);
      const datedComments = formatDates(formattedComments);
      console.log(datedComments);
      return knex("comments").insert(formattedComments);
    });
};
