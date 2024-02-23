const express = require("express");
const app = express();
const bodyParser = require("body-parser");
const cors = require("cors");
const env = require("dotenv").config();
const expressSession = require("express-session");

app.use(bodyParser.json());
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

app.use("trust proxy");

// ROUTES

// SERVER
const server = require("http").createServer(app);
server.listen(process.env.PORT, () => {
  console.log(`Server is running on port ${process.env.PORT}`);
});

// HEALTH CHECK
app.get("/health_check", (req, res) => {
  res.status(200).send("OK");
});