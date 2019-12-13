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
  return connection
    .insert(newComment)
    .into("comments")
    .returning("*")
    .then(result => result);
};

const fetchComments = (sort_by, order, article_id) => {
  const comments = connection
    .select(
      "comments.comment_id",
      "comments.votes",
      "comments.created_at",
      "comments.author",
      "comments.body"
    )
    .from("comments")
    .where("comments.article_id", article_id)
    .orderBy(sort_by || "created_at", order || "desc");

  return Promise.all([comments, checkArticleExists(article_id)]).then(
    promise => {
      if (promise[0].length === 0 && promise[1].length === 0) {
        return Promise.reject({ status: 404, msg: "Article not found" });
      } else if (promise[0].length === 0 && promise[1].length === 1) {
        return Promise.reject({
          status: 200,
          msg: "No comments found for article"
        });
      } else {
        return promise[0];
      }
    }
  );
};

const checkArticleExists = id => {
  return connection
    .select("article_id")
    .from("articles")
    .where("article_id", id);
};

const fetchAllArticles = (sort_by, order, author, topic) => {
  return connection
    .select(
      "articles.article_id",
      "articles.author",
      "articles.created_at",
      "articles.title",
      "articles.topic",
      "articles.votes"
    )
    .from("articles")
    .leftJoin("comments", "articles.article_id", "comments.article_id")
    .count({ comment_count: "comments.comment_id" })
    .groupBy("articles.article_id")
    .orderBy(sort_by || "created_at", order || "desc")
    .modify(query => {
      if (author) {
        query.where("articles.author", "=", author);
      }
      if (topic) {
        query.where("articles.topic", "=", topic);
      }
    })
}

module.exports = {
  fetchArticle,
  updateArticle,
  insertComment,
  fetchComments,
  checkArticleExists,
  fetchAllArticles
};
