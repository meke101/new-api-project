const ENV = process.env.NODE_ENV || "development";
console.log("knex file....");
//to point knex towards our mig/seed files
const baseConfig = {
  client: "pg",
  migrations: {
    directory: "./db/migrations"
  },
  seeds: {
    directory: "./db/seeds"
  }
};

const customConfig = {
  development: {
    connection: {
      database: "nc_news2",
      username: "acaffrey",
      password: "Sherbertv101."
    }
  },
  test: {
    connection: {
      database: "nc_news_test2",
      username: "acaffrey",
      password: "Sherbertv101."
    }
  }
};

module.exports = { ...customConfig[ENV], ...baseConfig };
