let sessionOptions = {};
if (process.env.NODE_ENV === "production") {
  sessionOptions = {
    secret: process.env.SECRET,
    resave: false,
    saveUninitialized: true,
  };
}
if (process.env.NODE_ENV === "development") {
  sessionOptions = {
    resave: false,
    saveUninitialized: true,
    secret: "secret",
  };
}

module.exports = sessionOptions;