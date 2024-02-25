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
app.use('/juegos', require('./routers/juego.router.js'));
app.use('/solana', require('./routers/solana.router.js'));
app.use('/deseados', require('./routers/deseados.router.js'));
app.use('/historialcompras', require('./routers/historialcompras.router.js'));
app.use('/compras', require('./routers/compra.router.js'));
app.use('/publicaciones', require('./routers/publicaciones.router.js'));
// SERVER
const server = require("http").createServer(app);
server.listen(process.env.PORT, () => {
  console.log(`Server is running on port ${process.env.PORT}`);
});
// HEALTH CHECK
app.get("/health_check", (req, res) => {
  res.status(200).send("OK");
});