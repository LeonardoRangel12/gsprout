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
  
  const token = req.headers.authorization;
  try{
    if(!token) return res.status(401).send("Unauthorized");
  
    const { username } = jwtUtil.verifyToken(token);
    if (!username) return res.status(401).send("Unauthorized");
    if (!(await usuarioService.getUsuarioByUsername(username)))
      return res.status(403).send("User not found");
  
    next();

  }
  catch(err){
    return res.status(401).send("Unauthorized");
  }
};

module.exports = { verifySession };
