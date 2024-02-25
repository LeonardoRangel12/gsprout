const Joi = require('joi');

const usuarioSchema = Joi.object({
    username: Joi.string().min(3).max(30).required(),
    email: Joi.string().email().required(),
    password: Joi.string().min(8).max(30).required(),
    nombre: Joi.string().min(3).max(30).required(),
    apellido: Joi.string().min(3).max(30).required(),
    descripcion: Joi.string().min(3).max(100).optional(),
    horas_juego: Joi.number().min(0).optional(),
});

module.exports = usuarioSchema;