const jwtSchema = require("../models/jwt.model");
const usuarioSchema = require("../models/usuario.model");
const usuarioService = require("../services/usuario.service");
const bcryptUtil = require("../utils/bcrypt.util");
const jwtUtil = require("../utils/jwt.util");

const usuarioSalt = "usuario";

const createUsuario = async (req, res, next) => {
  try {
    // Validate request with JOI
    let { error, value } = usuarioSchema.validate(req.body);
    if (error) {
      return res.status(400).send(error.details);
    }
  
    if (await usuarioService.getUsuarioByUsername(value.username)) {
      return res.status(400).send("User exists with that username");
    }
  
    // // Hashes password
    value.password = await bcryptUtil.hashPassword(value.password);
  
    // Create user
    const usuario = await usuarioService.createUsuario(value);
    // req.redis = {
    //   key: `${usuarioSalt}`,
    //   data: usuario,
    // };
    req.toCache = usuario;
    // res.status(201).send(usuario);
    next();
  } catch (error) {
    return res.status(500).send(error);
  }
};

const getUsuarios = async (req, res, next) => {
  // Get all users
  try {
    const usuarios = await usuarioService.getUsuarios();
    // req.redis = {
    //   key: `${usuarioSalt}`,
    //   data: usuarios,
    // };
    req.toCache  = usuarios;
    // res.status(200).send(usuarios);
    next();
  } catch (error) {
    return res.status(500).send(error);
  }
};

const loginUsuario = async (req, res, next) => {
  try {
    // // Get user by email
    // const { error, value } = jwtSchema.validate(req.body);
    // if (error) {
    //   return res.status(400).send(error.details);
    // }
    const { username, publicKey } = req.body;
    const usuario = await usuarioService.loginUsuario(username, publicKey);
    if (!usuario) return res.status(404).send("User not found");
    // Compare password
    const { password } = req.body;
    if (!(await bcryptUtil.comparePassword(password, usuario.password)))
      return res.status(401).send("Invalid password");

    // Generate token
    const data = { username: usuario.username, _id: usuario._id };
    const token = jwtUtil.generateToken(data);
    return res.status(200).json({ token, username: usuario.username });
  } catch (error) {
    console.log(error);
    return res.status(500).send(error);
  }
};
const getUsuarioById = async (req, res, next) => {
  try {
    const usuario = await usuarioService.getUsuarioByUsername(
      req.params.username
    );
    if (!usuario) return res.status(404).send("User not found");
    // req.redis = {
    //   key: `${usuarioSalt}:${req.params.username}`,
    //   data: usuario,
    // };
    req.toCache = usuario;
    // res.status(200).send(usuario);
    next();
  } catch (error) {
    return res.status(500).send(error);
  }
};

const updateUsuario = async (req, res, next) => {
  try {
    const value = req.body;
    const usuario = await usuarioService.updateUsuario(
      req.token.username,
      value
    );
    if (!usuario) return res.status(404).send("User not found");

    // req.redis = {
    //   key: `${usuarioSalt}:${req.params.username}`,
    //   data: usuario,
    // };
    req.toCache = usuario;
    // res.status(200).send(usuario);
    next();
  } catch (error) {
    return res.status(500).send(error);
  }
};

const deleteUsuario = async (req, res, next) => {
  if (!(await usuarioService.getUsuarioByUsername(req.params.username))) {
    return res.status(400).send("User does not exist");
  }

  try {
    if (!(await usuarioService.deleteUsuario(req.params.email)))
      return res.status(404).send("User not found");
    // req.redis = {
    //   key: `${usuarioSalt}:${req.params.username}`,
    // };
    res.status(200).send("User deleted");
    next();
  } catch (error) {
    return res.status(500).send(error);
  }
};

// EXPRESS-SESSION
// const logoutUsuario = async (req, res) => {
//   req.session.destroy();
//   res.status(200).send("Logged out");
// };

const getUsuario = async (req, res, next) => {
  // defined in session.middleware.js
  const token = req.token;

  if (!token) return res.status(401).send("Unauthorized");
  const usuario = await usuarioService.getUsuarioByUsername(token.username);
  if (!usuario) return res.status(404).send("User not found");
  return res.status(200).send(usuario);
};

const addToWishList = async (req, res, next) => {
  try{
    // defined in session.middleware.js
    const {username} = req.token;
    const { id } = req.params;
  
    const usuario = await usuarioService.addToWishList(username, id);
    if (!usuario) return res.status(404).send("User not found");
  
    return res.status(200).send(usuario);

  }
  catch(err){
    return res.status(500).send(err);
  }
};
const removeFromWishList = async (req, res, next) => {
  try{
    // defined in session.middleware.js
    const {username} = req.token;
    const { id } = req.params;
  
    const usuario = await usuarioService.removeFromWishList(username, id);
    if (!usuario) return res.status(404).send("User not found");
  
    return res.status(200).send(usuario);

  }
  catch(err){
    return res.status(500).send(err);
  }
};

const getJuegosInWishList = async (req, res, next) => {
  try{
    const { getJuegosInArray } = require("../services/juego.service");
  
    // defined in session.middleware.js
    const { username } = req.token;
    const usuario = await usuarioService.getUsuarioByUsername(username);
  
    if (!usuario) return res.status(404).send("User not found");
    const juegos = await getJuegosInArray(usuario.wishList);
  
    req.toCache = juegos;
    // res.status(200).send(juegos);

    next();
  }
  catch(err){
    return res.status(500).send(err);
  }
};

// const generateCacheKey = (req, res, next) => {
  
//   // const key = username ? `${usuarioSalt}:${username}` : `${usuarioSalt}`;
//   // req.redis = {
//   //   key,
//   // };
//   const {url, query} = req;
//   const queryString = Object.keys(query).length > 0 ? `?${Object.keys(query).map(([key,value]) => `${key}=${query[key]}`).join('&')}`: '';
  
//   next();
// };

module.exports = {
  createUsuario,
  getUsuarios,
  getUsuarioById,
  loginUsuario,
  updateUsuario,
  deleteUsuario,
  // logoutUsuario,
  getUsuario,
  // generateCacheKey,
  addToWishList,
  removeFromWishList,
  getJuegosInWishList,
};
