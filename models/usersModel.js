const connection = require("../db/connection");

exports.fetchUsers = username => {
  return connection
    .select("*")
    .from("users")
    .where(username)
    .returning("*")
    .then(result => {
      if (result.length === 0) {
        return Promise.reject({
          status: 404,
          msg: "User does not exist"
        });
      } else return result;
    });
};
