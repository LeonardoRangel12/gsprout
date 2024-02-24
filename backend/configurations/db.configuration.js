let db;

if(process.env.NODE_ENV === "production") {
  db = require("../db/mongodb");
}
if(process.env.NODE_ENV === "development") {
  db = require("../db/mongodb");
}

module.exports = db;
