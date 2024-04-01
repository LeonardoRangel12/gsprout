const express = require("express");
const app = express();
const bodyParser = require("body-parser");
const cors = require("cors");
require("dotenv").config();
const server = require("http").createServer(app);
const io = require("socket.io")(server, {
  cors: {
    origin: "*",
  },
});
// const session = require("express-session");
app.set("trust proxy");

// BODY PARSER
app.use(bodyParser.json());
// CORS
const corsOptions = require("./configurations/cors.configuration");
app.use(cors(corsOptions));
// MIDDLEWARES
// const sessionOptions = require("./configurations/session.configuration");
// app.use(session(sessionOptions));

// createBubblegumTree();

// // GET buffer from assets image
// const fs = require("fs");
// const { uploadImage } = require("./utils/metaplex.util.js");
// const image  = fs.readFileSync("./assets/gsproutLogo.png");
// const buffer = Buffer.from(image, "utf-8");
// uploadImage(buffer).then((res) => {
//   console.log(res);
// });

// WEBSOCKET
require("./sockets/chat.socket")(io);

// Allow the use of the socket in other files
module.exports.io = io;

// ROUTES
app.use("/usuarios", require("./routers/usuario.router.js"));
app.use("/juegos", require("./routers/juego.router.js"));
app.use("/exchange", require("./routers/exchange.router.js"));
app.use("/solana", require("./routers/solana.router.js"));
app.use("/historialcompras", require("./routers/historialcompras.router.js"));
app.use("/compras", require("./routers/compra.router.js"));
app.use("/publicaciones", require("./routers/publicaciones.router.js"));
app.use('/chat',require('./routers/chat.router.js'));
// SERVER
server.listen(process.env.PORT, () => {
  console.log(`Server is running on port ${process.env.PORT}`);
});
// HEALTH CHECK
app.get("/health_check", (req, res) => {
  res.status(200).send("OK");
});

