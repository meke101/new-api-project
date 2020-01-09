const endPointsJSON = require("../endpoints.json");

exports.getAvailableEndpoints = (req, res, next) => {
  const availableEndpoints = endPointsJSON;
  res.status(200).json({ availableEndpoints });
};
