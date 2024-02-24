const usuarioSchema = require("../models/usuario.model");
const usuarioService = require("../services/usuario.service");
const bcryptUtil = require("../utils/bcrypt.util");
const createUsuario = async (req, res) => {
  // Validate request with JOI
  let { error, value } = usuarioSchema.validate(req.body);
  if (error) {
    return res.status(400).send(error.details);
  }

  //   Check if user exists
  if (await usuarioService.getUsuarioById(value.email)) {
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
    console.log(usuarios)
    return res.status(200).send(usuarios);
  } catch (error) {
    return res.status(500).send(error);
  }
};

const loginUsuario = async (req, res) => {
  try {
    // Get user by email
    const usuario = await usuarioService.getUsuarioById(req.body.email);
    if (!usuario) return res.status(404).send("User not found");
    // Compare password
    if (
      !(await bcryptUtil.comparePassword(req.body.password, usuario.password))
    )
      return res.status(401).send("Invalid password");
    req.session.usuario = usuario; 
    return res.status(200).send(usuario);
  } catch (error) {
    return res.status(500).send(error);
  }
};
const getUsuarioById = async (req, res) => {
  try {
    const usuario = await usuarioService.getUsuarioById(req.params.email);
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
  if (!await usuarioService.getUsuarioById(req.params.email)) {
    return res.status(400).send("User does not exist");
  }

  try {
    await usuarioService.deleteUsuario(req.params.email);
    return res.status(204).send();
  } catch (error) {
    return res.status;
  }
};

const logoutUsuario = async (req, res) => {
  req.session.destroy();
  res.status(200).send("Logged out");
};

module.exports = {
  createUsuario,
  getUsuarios,
  getUsuarioById,
  loginUsuario,
  updateUsuario,
  deleteUsuario,
  logoutUsuario,
};
