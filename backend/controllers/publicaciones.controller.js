const publicacionesSchema = require("../models/publicaciones.model");
const publicacionesService = require("../services/publicaciones.service");

const publicacionesSalt = "publicaciones";

const getPublicaciones = async (req, res, next) => {
  try {
    const publicaciones = await publicacionesService.getPublicaciones();
    if (!publicaciones) return res.status(404).send("No hay publicaciones");
    req.redis = {
      key: `${publicacionesSalt}`,
      data: publicaciones,
    };
    res.status(200).send(publicaciones);
    next();
  } catch (error) {
    // console.log(error)
    return res.status(500).send(error);
  }
};

const getPublicacionById = async (req, res, next) => {
  try {
    const publicacion = await publicacionesService.getPublicacionById(
      req.params.id
    );
    if (!publicacion) return res.status(404).send("Publicacion no existe");
    req.redis = {
      key: `${publicacionesSalt}:${req.params.id}`,
      data: publicacion,
    };
    res.status(200).send(publicacion);
    next();
  } catch (error) {
    return res.status(500).send(error);
  }
};

const createPublicacion = async (req, res, next) => {
  let { error, value } = publicacionesSchema.validate(req.body);
  if (error) {
    return res.status(400).send(error.details);
  }

  try {
    const publicacion = await publicacionesService.createPublicacion(value);
    req.redis = {
      key: `${publicacionesSalt}`,
      data: publicacion,
    };
    res.status(201).send(publicacion);
    next();
  } catch (error) {
    return res.status(500).send(error);
  }
};

const updatePublicacion = async (req, res,next) => {
  try {
    const publicacion = await publicacionesService.updatePublicacion(
      req.params.id,
      req.body
    );
    if (!publicacion) return res.status(404).send("Publicacion no existe");
    req.redis = {
      key: `${publicacionesSalt}:${req.params.id}`,
      data: publicacion,
    };
    res.status(200).send(publicacion);
    next();
  } catch (error) {
    console.log(error);
    return res.status(500).send(error);
  }
};

const deletePublicacion = async (req, res, next) => {
  if (!(await publicacionesService.getPublicacionById(req.params.id))) {
    return res.status(400).send("Publicacion no existe");
  }

  try {
    const publicacion = await publicacionesService.deletePublicacion(
      req.params.id
    );
    if (!publicacion) return res.status(404).send("Publicacion no existe");

    req.redis = {
      key: `${publicacionesSalt}:${req.params.id}`,
      data: publicacion,
    };
    res.status(200).send(publicacion);
    next();
  } catch (error) {
    return res.status(500).send(error);
  }
};

// const generateCacheKey = (req, res, next) => {
//   const { id } = req.params;
//   const key = id ? `${publicacionesSalt}:${id}` : `${publicacionesSalt}`;
//   req.redis = {
//     key,
//   };
//   next();
// };

module.exports = {
  getPublicacionById,
  getPublicaciones,
  createPublicacion,
  updatePublicacion,
  deletePublicacion,
  updatePublicacion,
  // generateCacheKey
};
