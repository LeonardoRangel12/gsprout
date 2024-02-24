const Joi = require('joi');
const juegoSchema = Joi.object({
    nombre: Joi.string().min(3).max(30).required(),
    descripcion: Joi.string().min(3).max(30).required(),
    categoria: Joi.string().min(3).max(30).required(),
    precio: Joi.number().required(),
    stock: Joi.number().optional(),
    imagen: Joi.object({
        filename: Joi.string().min(3).max(30).required().without('.'),
        extension: Joi.string().min(3).max(5).required().allow('png', 'jpg', 'jpeg'),
    }),
    urlNFT: Joi.string().min(3).max(30).optional(),
});

module.exports = juegoSchema;