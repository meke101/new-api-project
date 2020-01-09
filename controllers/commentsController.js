const { updateComment, removeComment } = require("../models/commentsModel");

exports.patchComment = (req, res, next) => {
  const { comment_id } = req.params;
  const { inc_votes } = req.body;
  updateComment(comment_id, inc_votes)
    .then(([comment]) => res.status(200).send({ comment }))
    .catch(next);
};

exports.deleteComment = (req, res, next) => {
  const id = req.params.comment_id;
  removeComment(id)
    .then(comment => res.sendStatus(204))
    .catch(next);
};
