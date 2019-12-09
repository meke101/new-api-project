exports.up = function(knex) {
  return knex.schema.createTable("articles", articleTable => {
    //increments:serial in pg
    console.log("creating articles...")
    articleTable.increments("article_id");
    articleTable.string("title").notNullable();
    articleTable.text("body").notNullable();
    articleTable.integer("votes").defaultTo(0);
    articleTable
      .string("topic")
      .references("topics.slug")
      .notNullable();
    articleTable
      .string("author")
      .references("users.username")
      .notNullable();
    articleTable.timestamp("created_at").defaultTo(knex.fn.now());
  });
};

exports.down = function(knex) {
  console.log("dropping articles...")
  return knex.schema.dropTable("articles");
};
