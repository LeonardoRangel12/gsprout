const Joi = require('joi');
const juegoSchema = Joi.object({
    nombre: Joi.string().min(3).max(30).required(),
    descripcion: Joi.string().min(3).max(30).required(),
    categoria: Joi.string().min(3).max(30).required(),
    precio: Joi.number().required(),
    stock: Joi.number().optional(),
    imagen: Joi.string().min(3).max(30).required().pattern(/^([a-zA-Z0-9])+\.(jpg|png|jpeg)$/), // Solo acepta imagenes con extension jpg, png o jpeg
    urlNFT: Joi.string().min(3).max(30).optional(),
});

module.exports = juegoSchema;