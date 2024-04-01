// const jwt = require("jsonwebtoken");
const jwtUtil = require("../utils/jwt.util");
const usuarioService = require("../services/usuario.service");
// const verifySession = (req, res, next) => {
// // Verify if the user is logged in
//   if (req.session.usuario) next();
//   else res.status(401).send("Unauthorized");
// };

const verifySession = async (req, res, next) => {
  // Verify if the user is logged in
  try{
    const token = req.headers.authorization;
    if(!token) return res.status(401).send("Unauthorized");
    const  data  = jwtUtil.verifyToken(token);
    if (!data) return res.status(401).send("Unauthorized");
    if (!(await usuarioService.getUsuarioByUsername(data.username)))
      return res.status(403).send("User not found");
    req.token = data;
    next();

  }
  catch(err){
    console.log(err);
    return res.status(500).send(err);
  }
};
module.exports = { verifySession };
