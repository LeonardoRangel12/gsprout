const express = require("express");
const app = express();
const bodyParser = require("body-parser");
const cors = require("cors");
const env = require("dotenv").config();
const session = require("express-session");

app.set("trust proxy");

// BODY PARSER
app.use(bodyParser.json());
// CORS
const corsOptions = require("./options/cors.options");
app.use(cors(corsOptions));
// MIDDLEWARES
const sessionOptions = require("./options/session.options");
app.use(session(sessionOptions));


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