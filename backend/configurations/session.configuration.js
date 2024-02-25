const { v4: uuidv4 } = require("uuid");
let sessionOptions = {};

if (process.env.NODE_ENV === "production") {
  sessionOptions = {
    secret: process.env.SECRET,
    resave: false,
    saveUninitialized: true,
    genid: function (req) {
      return uuidv4();
    },
  };
}
if (process.env.NODE_ENV === "development") {
  sessionOptions = {
    resave: false,
    saveUninitialized: true,
    secret: "secret",
    cookie: {
      domain: "localhost",
      secure: false,
      httpOnly: true,
      maxAge: 1000 * 60 * 60 * 24,
    },
  };
}

module.exports = sessionOptions;
