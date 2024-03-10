const { restart } = require("nodemon");
const juegoSchema = require("../../shared/models/juego.model");
const juegoService = require("../services/juego.service");
const cryptojsUtil = require("../utils/cryptojs.util");

//Creacion de juegos
const createJuego = async (req, res) => {
  let { error, value } = juegoSchema.validate(req.body);
  if (error) {
    //Si hay un error en la validacion
    return res.status(400).send(error.details);
  }

  if (await juegoService.getJuegoByName(value.nombre)) {
    //Niega la creacion si este existe
    return res.status(400).send("Juego existe");
  }

  // Encripta el regex de la licencia
  value.regexLicense = await cryptojsUtil.encrypt(value.regexLicense);
  try {
    const juego = await juegoService.createJuego(value);
    req.name = juego;
    return res.status(201).send(juego);
  } catch (error) {
    return res.status(500).send(error);
  }
};

//Creacion de varios juegos
const createSeveralJuegos = async (req, res) => {
  let juegos = req.body;
  for (let i = 0; i < juegos.length; i++) {
    juegos[i].regexLicense = juegos[i].regex;
    delete juegos[i].regex;
    juegos[i].regexLicense = bcryptUtil.hashPassword(juegos[i].regexLicense);
    juegos[i].precio = 1;
    try {
      const juego = await juegoService.createJuego(juegos[i]);
    } catch (error) {
      return res.status(500).send(error);
    }
  }
  return res.status(201).send(juegos);
};

//Obtencion de juegos
const getJuegos = async (req, res) => {
  try {
    const juegos = await juegoService.getJuegos();
    return res.status(200).send(juegos);
  } catch {
    return res.status(500).send("Internal Server Error");
  }
};

//Obtencion de juego por id
const getJuegoById = async (req, res) => {
  try {
    const juego = await juegoService.getJuegoById(req.params.id);
    return res.status(200).send(juego);
  } catch {
    return res.status(500).send("Internal Server Error");
  }
};

//Actualizar juego
const updateJuego = async (req, res) => {
  let { error, value } = juegoSchema.validate(req.body);
  if (error) {
    //Si hay un error en la validacion
    return res.status(400).send(error.details);
  }
  try {
    const juego = await juegoService.updateJuego(req.params.id, value);
    return res.status(200).send(juego);
  } catch {
    return res.status(500).send(error);
  }
};

//Eliminar juego
const deleteJuego = async (req, res) => {
  try {
    const juego = await juegoService.deleteJuego(req.params.id);
    return res.status(200).send(juego);
  } catch {
    return res.status(500).send(error);
  }
};

module.exports = {
  createJuego,
  getJuegos,
  getJuegoById,
  updateJuego,
  deleteJuego,
  createSeveralJuegos,
};
