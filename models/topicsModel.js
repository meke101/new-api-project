const connection = require("../db/connection");
console.log("topics model....");

exports.fetchTopics = () => {
  console.log("fetch topic model");
  return connection
    .select("*")
    .from("topics")
    .returning("*");
};
