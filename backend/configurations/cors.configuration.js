let corsOptions = {};

if (process.env.NODE_ENV === "production") {
  corsOptions = {
    origin: "http://frontend",
    credentials: true,
  };
}
if (process.env.NODE_ENV === "development") {
  corsOptions = {
    origin: true,
    credentials: true,
  };
}

module.exports = corsOptions;
