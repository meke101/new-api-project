//linking current config db and knex
console.log("connection.js...")
const knex = require("knex");
const dbConfig = require("../knexfile");

const connection = knex(dbConfig);

module.exports = connection;
