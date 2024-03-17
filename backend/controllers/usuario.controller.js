const jwtSchema = require("../models/jwt.model");
const usuarioSchema = require("../models/usuario.model");
const usuarioService = require("../services/usuario.service");
const bcryptUtil = require("../utils/bcrypt.util");
const jwtUtil = require("../utils/jwt.util");

const usuarioSalt = "usuario";

const createUsuario = async (req, res, next) => {
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
  try {
    const usuario = await usuarioService.createUsuario(value);
    req.redis  ={
      key: `${usuarioSalt}`,
      data: usuario,
      status: 201
    }
    // return res.status(201).send(usuario);
  } catch (error) {
    return res.status(500).send(error);
  }
};

const getUsuarios = async (req, res, next) => {
  // Get all users
  try {
    const usuarios = await usuarioService.getUsuarios();
    req.redis = {
      key: `${usuarioSalt}`,
      data: usuarios,
      status: 200
    }
    next();
    // return res.status(200).send(usuarios);
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
    const usuario = await usuarioService.loginUsuario( username, publicKey);
    if (!usuario) return res.status(404).send("User not found");
    // Compare password
    const { password } = req.body;
    if (!(await bcryptUtil.comparePassword(password, usuario.password)))
      return res.status(401).send("Invalid password");

    // Generate token
    const data = { username: usuario.username, _id : usuario._id};
    const token = jwtUtil.generateToken(data);
    return res.status(200).json({ token, username: usuario.username });
  } catch (error) {
    console.log(error);
    return res.status(500).send(error);
  }
};
const getUsuarioById = async (req, res, next) => {
  try {
    const usuario = await usuarioService.getUsuarioByUsername(req.params.username);
    if (!usuario) return res.status(404).send("User not found");
    req.redis = {
      key: `${usuarioSalt}:${req.params.username}`,
      data: usuario,
      status: 200
    }
    next();
    // return res.status(200).send(usuario);
  } catch (error) {
    return res.status(500).send(error);
  }
};

const updateUsuario = async (req, res, next) => {
  const { error, value } = usuarioSchema.validate(req.body);
  if (error) {
    return res.status(400).send(error.details);
  }

  try {
    const usuario = await usuarioService.updateUsuario(req.params.username, value);
    if (!usuario) return res.status(404).send("User not found");

    req.redis = {
      key: `${usuarioSalt}:${req.params.username}`,
      data: usuario,
      status: 200
    }
    next();
    // return res.status(200).send(usuario);
  } catch (error) {
    return res.status(500).send(error);
  }
};

const deleteUsuario = async (req, res, next) => {
  if (!(await usuarioService.getUsuarioByUsername(req.params.username))) {
    return res.status(400).send("User does not exist");
  }

  try {
    await usuarioService.deleteUsuario(req.params.email);
    req.redis = {
      key: `${usuarioSalt}:${req.params.username}`,
      status: 204
    }
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
    const token = jwtUtil.verifyToken(req.headers.authorization);
    if (!token) return res.status(401).send("Unauthorized");
    const usuario = await usuarioService.getUsuarioByUsername(token.username);
    if (!usuario) return res.status(404).send("User not found");
    return res.status(200).send(usuario);
};

const addToWishList = async (req, res, next) => {
  
  const {username} = jwtUtil.verifyToken(req.headers.authorization);
  const { id } = req.params;

  const usuario = await usuarioService.addToWishList(username, id);
  if (!usuario) return res.status(404).send("User not found");

  return res.status(200).send(usuario);
}
const removeFromWishList = async (req, res, next) => {
  
  const {username} = jwtUtil.verifyToken(req.headers.authorization);
  const { id } = req.params;

  const usuario = await usuarioService.removeFromWishList(username, id);
  if (!usuario) return res.status(404).send("User not found");

  return res.status(200).send(usuario);
}

const generateCacheKey = (req, res, next) => {
  const { username } = req.params;
  const key = username ? `${usuarioSalt}:${username}` : `${usuarioSalt}`;
  req.redis = {
    key
  };
  next();
};



module.exports = {
  createUsuario,
  getUsuarios,
  getUsuarioById,
  loginUsuario,
  updateUsuario,
  deleteUsuario,
  // logoutUsuario,
  getUsuario,
  generateCacheKey,
  addToWishList,
  removeFromWishList,
};
