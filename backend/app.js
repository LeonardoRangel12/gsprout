const express = require("express");
const app = express();
const env = require("dotenv").config();
const expressSession = require("express-session");
const bodyParser = require("body-parser");
const http = require("http").createServer(app);
const cors = require("cors");
app.use("trust proxy", 1);

// CORS
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
app.use(cors(corsOptions));
// MIDDLEWARES
app.use(bodyParser.json());
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
  };
}
app.use(sessionOptions);
// ROUTES

// SERVER
http.listen(process.env.PORT, () => {
  console.log(`Server is running on port ${process.env.PORT}`);
});

// HEALTH CHECK
app.get("/health_check", (req, res) => {
  res.status(200).send("OK");
});