const Joi = require('joi');
const juegoSchema = Joi.object({
    nombre: Joi.string().min(3).max(30).required(),
    descripcion: Joi.string().min(3).max(30).required(),
    categoria: Joi.string().min(3).max(30).required(),
    precio: Joi.number().required().min(0.000000001),
    imagen: Joi.string().min(3).max(30).required().pattern(/^([a-zA-Z0-9])+\.(jpg|png|jpeg)$/), // Solo acepta imagenes con extension jpg, png o jpeg
    urlNFT: Joi.string().min(3).max(80).optional(),
    regexLicense: Joi.string().min(3).max(80).optional()
});
module.exports = juegoSchema;