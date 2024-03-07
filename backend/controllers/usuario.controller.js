const jwtSchema = require("../models/jwt.model");
const usuarioSchema = require("../models/usuario.model");
const usuarioService = require("../services/usuario.service");
const bcryptUtil = require("../utils/bcrypt.util");
const jwtUtil = require("../utils/jwt.util");
const createUsuario = async (req, res) => {
  // Validate request with JOI
  let { error, value } = usuarioSchema.validate(req.body);
  if (error) {
    return res.status(400).send(error.details);
  }

  //   Check if user exists
  if (await usuarioService.getUsuarioByEmail(value.email)) {
    return res.status(400).send("User exists");
  }

  // Hashes password
  value.password = await bcryptUtil.hashPassword(value.password);

  // Create user
  try {
    const usuario = await usuarioService.createUsuario(value);
    return res.status(201).send(usuario);
  } catch (error) {
    return res.status(500).send(error);
  }
};

const getUsuarios = async (req, res) => {
  // Get all users
  try {
    const usuarios = await usuarioService.getUsuarios();
    return res.status(200).send(usuarios);
  } catch (error) {
    return res.status(500).send(error);
  }
};

const loginUsuario = async (req, res) => {
  try {
    // Get user by email
    const { error, value } = jwtSchema.validate(req.body);
    if (error) {
      return res.status(400).send(error.details);
    }
    const { email, password } = value;
    const usuario = await usuarioService.getUsuarioByEmail(email);
    if (!usuario) return res.status(404).send("User not found");
    // Compare password
    if (!(await bcryptUtil.comparePassword(password, usuario.password)))
      return res.status(401).send("Invalid password");

    const token = await jwtUtil.generateToken(usuario);
    return res.status(200).json({ token });
  } catch (error) {
    return res.status(500).send(error);
  }
};
const getUsuarioById = async (req, res) => {
  try {
    const usuario = await usuarioService.getUsuarioByEmail(req.params.email);
    return res.status(200).send(usuario);
  } catch (error) {
    return res.status(500).send(error);
  }
};

const updateUsuario = async (req, res) => {
  const { error, value } = usuarioSchema.validate(req.body);
  if (error) {
    return res.status(400).send(error.details);
  }

  try {
    const usuario = await usuarioService.updateUsuario(req.params.email, value);
    return res.status(200).send(usuario);
  } catch (error) {
    return res.status(500).send(error);
  }
};

const deleteUsuario = async (req, res) => {
  if (!(await usuarioService.getUsuarioByEmail(req.params.email))) {
    return res.status(400).send("User does not exist");
  }

  try {
    await usuarioService.deleteUsuario(req.params.email);
    return res.status(204).send();
  } catch (error) {
    return res.status;
  }
};

// EXPRESS-SESSION
// const logoutUsuario = async (req, res) => {
//   req.session.destroy();
//   res.status(200).send("Logged out");
// };

const getUsuario = async (req, res) => {

  const client = req.usuario;
  if (client) {
    const usuario = await usuarioService.getUsuarioByEmail(client.email);
    return res.status(200).send(usuario);
  }
  return res.status(404).send("User not found");
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
};
