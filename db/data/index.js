const ENV = process.env.NODE_ENV || "development";

const testData = require("./test-data");
const devData = require("./development-data");

//determines which data set to export (defaulting development)
const dataSet = {
  development: devData,
  test: testData
};

module.exports = dataSet[ENV];
