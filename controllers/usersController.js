const { fetchUser } = require("../models/usersModel");

exports.getUser = (req, res, next) => {
  fetchUser(req.params)
    .then(([user]) => res.status(200).send({ user }))
    .catch(next);
};
