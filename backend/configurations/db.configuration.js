let db;

// JARA CHAMBA
if(process.env.NODE_ENV === "production") {
//   db = require("../db/");
}
if(process.env.NODE_ENV === "development") {
//   db = require("../db/archivo");
}

module.exports = db;
