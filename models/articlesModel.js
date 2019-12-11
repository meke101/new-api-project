const connection = require("../db/connection");

const fetchArticle = id => {
  return connection
    .select("articles.*")
    .from("articles")
    .leftJoin("comments", "comments.article_id", "=", "articles.article_id")
    .where("articles.article_id", id)
    .groupBy("articles.article_id")
    .count("comment_id as comment_count")
    .then(article => {
      if (article.length === 0) {
        return Promise.reject({ status: 404, msg: "Not found" });
      } else return article;
    });
};

const updateArticle = (id, increment) => {
  return connection
    .select("articles.*")
    .from("articles")
    .where("articles.article_id", id)
    .increment("votes", increment)
    .returning("*")
    .then(result => result);
};

const insertComment = newComment => {
  console.log("artcle model");
  return connection
    .insert(newComment)
    .into("comments")
    .returning("*")
    .then(result => result);
};

module.exports = { fetchArticle, updateArticle, insertComment };
