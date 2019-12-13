const {
  fetchArticle,
  updateArticle,
  insertComment,
  fetchComments,
  fetchAllArticles
} = require("../models/articlesModel");


exports.getArticle = (req, res, next) => {
  fetchArticle(req.params.article_id)
    .then(([article]) => res.status(200).send({ article: article }))
    .catch(next);
};

exports.patchArticle = (req, res, next) => {
  const id = req.params.article_id;
  const increment = req.body.inc_votes;
  updateArticle(id, increment)
    .then(([article]) => res.status(200).send({ article: article }))
    .catch(next);
};

exports.postComment = (req, res, next) => {
  const comment = req.body;
  comment.author = comment.username;
  delete comment.username;
  comment.article_id = req.params.article_id;
  insertComment(req.body)
    .then(([comment]) => res.status(201).send({ comment }))
    .catch(next);
};

exports.getComments = (req, res, next) => {
  const { sort_by, order } = req.query;
  const article_id = req.params.article_id;
  fetchComments(sort_by, order, article_id)
    .then(comments => res.status(200).send({ comments }))
    .catch(next);
};

exports.getArticles = (req, res, next) => {
  const { sort_by, order, author, topic } = req.query;
  fetchAllArticles(sort_by, order, author, topic)
    .then(articles => {
      res.status(200).send({ articles });
    })
    .catch(next);
};
