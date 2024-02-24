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
const corsOptions = require("./configurations/cors.configuration");
app.use(cors(corsOptions));
// MIDDLEWARES
const sessionOptions = require("./configurations/session.configuration");
app.use(session(sessionOptions));


// ROUTES
app.use('/usuarios',require('./routers/usuario.router.js'));
// SERVER
const server = require("http").createServer(app);
server.listen(process.env.PORT, () => {
  console.log(`Server is running on port ${process.env.PORT}`);
});

// HEALTH CHECK
app.get("/health_check", (req, res) => {
  res.status(200).send("OK");
});