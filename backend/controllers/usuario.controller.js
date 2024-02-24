const usuarioSchema = require("../models/usuario.model");
const usuarioService = require("../services/usuario.service");
const bcryptUtil = require("../utils/bcrypt.util");
const createUsuario = async (req, res) => {
  let { error, value } = usuarioSchema.validate(req.body);
  if (error) {
    return res.status(400).send(error.details);
  }

  if (usuarioService.getUsuarioById(value.email)) {
    return res.status(400).send("User exists");
  }

  value.password = await bcryptUtil.hashPassword(value.password);

  try {
    const usuario = await usuarioService.createUsuario(value);
    req.session.usuario = usuario;
    res.status(201).send(usuario);
  } catch (error) {
    res.status(500).send(error);
  }
};

const getUsuarios = async (req, res) => {
  try {
    const usuarios = await usuarioService.getUsuarios();
    res.status(200).send(usuarios);
  } catch (error) {
    res.status(500).send(error);
  }
};

const loginUsuario = async (req, res) => {
  try {
    const usuario = await usuarioService.getUsuarioById(req.body.email);
    if (usuario) req.session.usuario = usuario;
    res.status(200).send(usuario);
  } catch (error) {
    res.status;
  }
};
const getUsuarioById = async (req, res) => {
  try {
    const usuario = await usuarioService.getUsuarioById(req.params.email);
    res.status(200).send(usuario);
  } catch (error) {
    res.status(500).send(error);
  }
};

const updateUsuario = async (req, res) => {
  const { error, value } = usuarioSchema.validate(req.body);
  if (error) {
    return res.status(400).send(error.details);
  }

  try {
    const usuario = await usuarioService.updateUsuario(req.params.email, value);
    res.status(200).send(usuario);
  } catch (error) {
    res.status(500).send(error);
  }
};

const deleteUsuario = async (req, res) => {
  try {
    await usuarioService.deleteUsuario(req.params.email);
    res.status(204).send();
  } catch (error) {
    res.status;
  }
};
module.exports = {
  createUsuario,
  getUsuarios,
  getUsuarioById,
  loginUsuario,
  updateUsuario,
  deleteUsuario,
};
