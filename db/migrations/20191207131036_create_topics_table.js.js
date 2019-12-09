exports.up = function(knex) {
  return knex.schema.createTable("topics", topicTable => {
    console.log("creating topics...");
    topicTable
      .string("slug")
      .unique()
      .primary();
    topicTable.string("description").notNullable();
  });
};

exports.down = function(knex) {
  console.log("dropping topics...");
  return knex.schema.dropTable("topics");
};
