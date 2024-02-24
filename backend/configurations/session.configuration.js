let sessionOptions = {};
if (process.env.NODE_ENV === "production") {
  sessionOptions = {
    secret: process.env.SESSION_SECRET,
    resave: false,
    saveUninitialized: true,
  };
}
if (process.env.NODE_ENV === "development") {
  sessionOptions = {
    resave: false,
    saveUninitialized: true,
    session: "secret",
  };
}

module.exports = sessionOptions;