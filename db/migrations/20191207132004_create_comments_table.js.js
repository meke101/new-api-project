exports.up = function(knex) {
  return knex.schema.createTable("comments", commentTable => {
    console.log("creating comments..");
    commentTable.increments("comment_id");
    commentTable
      .string("author")
      .references("users.username")
      .notNullable();
    commentTable
      .integer("article_id")
      .references("articles.article_id")
      .notNullable();
    commentTable.integer("votes").defaultTo(0);
    commentTable.timestamp("created_at").defaultTo(knex.fn.now());
    commentTable.text("body").notNullable();
  });
};

exports.down = function(knex) {
  console.log("dropping comments...");
  return knex.schema.dropTable("comments");
};
