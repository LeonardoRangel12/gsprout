const { query } = require("express");
const juegoSchema = require("../models/juego.model");
const searchJuegosSchema = require("../models/searchJuegos.model");
const juegoService = require("../services/juego.service");
const cryptojsUtil = require("../utils/cryptojs.util");
const { func } = require("joi");

// Para redis
const juegoSalt = "juego";

//Creacion de juegos
const createJuego = async (req, res, next) => {
  try {
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
    const juego = await juegoService.createJuego(value);
    req.toCache = juego;

    // res.status(201).send(juego);
    next();
  } catch (error) {
    return res.status(500).send(error);
  }
};

//Creacion de varios juegos
const createSeveralJuegos = async (req, res, next) => {
  try {
    let juegos = req.body;
    for (let i = 0; i < juegos.length; i++) {
      juegos[i].regexLicense = juegos[i].regex;
      delete juegos[i].regex;
      juegos[i].regexLicense = bcryptUtil.hashPassword(juegos[i].regexLicense);
      juegos[i].precio = 1;
      const juego = await juegoService.createJuego(juegos[i]);
      return res.status(500).send(error);
    }
    req.toCache = juegos;
    next();
  } catch (error) {
    return res.status(500).send(error);
  }

  // res.status(201).send(juegos);
};

function convertPageNumber(page_number) {
  if (
    page_number &&
    parseInt(page_number) > 0 &&
    !isNaN(parseInt(page_number))
  ) {
    return page_number;
  } else {
    return 1;
  }
}

const getJuegos = async (req, res, next) => {
  try {
    const page_number = convertPageNumber(req.query.page);

    const sorting_type = req.query.sorting_type || "peak_ccu";

    const juegos = await juegoService.getJuegos(page_number, sorting_type);

    //Probably going to be changed....
    req.toCache = juegos;

    next();
  } catch (error) {
    console.log(error);
    return res.status(500).send("Internal Server Error");
  }
};

//Obtencion de juego por id
const getJuegoById = async (req, res, next) => {
  try {
    const juego = await juegoService.getJuegoById(req.params.id);
    if (!juego) return res.status(404).send("Juego no existe");
    req.toCache = juego;

    // res.status(200).send(juego);
    next();
  } catch {
    return res.status(500).send("Internal Server Error");
  }
};

const autocompleteJuegosSearch = async (req, res) => {
  try {
    const query = req.params.query;
    const juegos = await juegoService.autocompleteJuegosSearch(query);
    return res.status(200).send(juegos);
  } catch (error) {
    console.log(error);
    return res.status(500).send("Internal Server Error");
  }
};

const searchJuegos = async (req, res) => {
  try {
    let { error, value } = searchJuegosSchema.validate(req.body);
    if (error) {
      //Si hay un error en la validacion
      return res.status(400).send(error.details);
    }
    const searchParams = value;
    if (searchParams.minPrice > searchParams.maxPrice) {
      return res.status(400).send("Invalid price range");
    }
    //check for query param page_number
    const page_number = convertPageNumber(req.query.page);

    const sorting_type = req.query.sorting_type || "peak_ccu";

    const juegos = await juegoService.searchJuegos(
      searchParams,
      page_number,
      sorting_type
    );
    return res.status(200).send(juegos);
  } catch (error) {
    console.log(error);
    return res.status(500).send("Internal Server Err");
  }
};

//Actualizar juego
const updateJuego = async (req, res, next) => {
  try {
    //getting empty fields out from the request
    for (let key in req.body) {
      if (req.body[key] === "") {
        delete req.body[key];
      }
    }

    let { error, value } = juegoSchema.validate(req.body);
    if (error) {
      //Si hay un error en la validacion
      return res.status(400).send(error.details);
    }
    const juego = await juegoService.updateJuego(req.params.id, value);
    if (!juego) return res.status(404).send("Juego no existe");

    req.toCache = juego;

    // res.status(200).send(juego);
    next();
  } catch {
    return res.status(500).send(error);
  }
};

//Eliminar juego
const deleteJuego = async (req, res, next) => {
  try {
    const juego = await juegoService.deleteJuego(req.params.id);
    if (!juego) return res.status(404).send("Juego no existe");

    req.toCache = juego;
    // res.status(200).send(juego);
    next();
  } catch {
    return res.status(500).send(error);
  }
};

// const generateCacheKey = (req, res, next) => {
//   const { id } = req.params;
//   const key = id ? `${juegoSalt}:${id}` : `${juegoSalt}`;
//   req.redis = {
//     key
//   };
//   next();
// };
module.exports = {
  createJuego,
  getJuegos,
  getJuegoById,
  updateJuego,
  deleteJuego,
  createSeveralJuegos,
  // generateCacheKey,
  searchJuegos,
  autocompleteJuegosSearch,
};
