exports.up = function(knex) {
  return knex.schema.createTable("users", userTable => {
    console.log("creating users..")
    userTable
      .string("username")
      .unique()
      .primary();
    userTable.string("avatar_url");
    userTable.string("name").notNullable();
  });
};

exports.down = function(knex) {
  console.log("dropping users...")
  return knex.schema.dropTable("users");
};
