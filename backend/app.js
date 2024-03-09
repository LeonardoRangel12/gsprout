const express = require("express");
const app = express();
const bodyParser = require("body-parser");
const cors = require("cors");
const env = require("dotenv").config();
// const session = require("express-session");
app.set("trust proxy");

// BODY PARSER
app.use(bodyParser.json());
// CORS
const corsOptions = require("./configurations/cors.configuration");
const { createBubblegumTree, fetchNFT } = require("./utils/metaplex.util.js");
app.use(cors(corsOptions));
// MIDDLEWARES
// const sessionOptions = require("./configurations/session.configuration");
// app.use(session(sessionOptions));

// createBubblegumTree();

// const signature = new Uint8Array([
//   56, 92, 193, 135, 3, 156, 36, 58, 244, 9, 113, 223, 42, 219, 53, 170, 217,
//   135, 94, 71, 251, 102, 178, 119, 147, 94, 221, 141, 201, 95, 3, 80, 221, 172,
//   80, 139, 109, 193, 148, 183, 58, 0, 12, 116, 214, 135, 243, 43, 98, 69, 82,
//   123, 188, 1, 18, 114, 253, 128, 209, 17, 224, 187, 127, 10,
// ]);
// fetchNFT(signature).then((res) => {
//   console.log(res);
// });

// ROUTES
app.use("/usuarios", require("./routers/usuario.router.js"));
app.use("/juegos", require("./routers/juego.router.js"));
app.use("/exchange", require("./routers/exchange.router.js"));
app.use("/solana", require("./routers/solana.router.js"));
app.use("/deseados", require("./routers/deseados.router.js"));
app.use("/historialcompras", require("./routers/historialcompras.router.js"));
app.use("/compras", require("./routers/compra.router.js"));
app.use("/publicaciones", require("./routers/publicaciones.router.js"));
// SERVER
const server = require("http").createServer(app);
server.listen(process.env.PORT, () => {
  console.log(`Server is running on port ${process.env.PORT}`);
});
// HEALTH CHECK
app.get("/health_check", (req, res) => {
  res.status(200).send("OK");
});
//
