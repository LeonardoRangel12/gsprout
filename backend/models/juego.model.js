const Joi = require('joi');
const juegoSchema = Joi.object({
    nombre: Joi.string().min(3).max(30).required(),
    descripcion: Joi.string().min(3).max(30).required(),
    categoria:  Joi.array().items(Joi.string()),
    precio: Joi.number().required().min(0.000000001),
    imagen: Joi.string().min(3).max(1000).required(),
    gallery: Joi.array().items(Joi.string().min(3).max(1000)).optional(),
    //For the future...
    //imagen: Joi.string().min(3).max(100).required().pattern(/^([a-zA-Z0-9])+\.(jpg|png|jpeg)$/), // Solo acepta imagenes con extension jpg, png o jpeg
    regexLicense: Joi.string().min(3).max(80).optional()
});
module.exports = juegoSchema;