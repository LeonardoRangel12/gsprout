const Joi = require('joi');

const usuarioSchema = Joi.object({
    username: Joi.string().min(3).max(30).required(),
    email: Joi.string().email().required(),
    password: Joi.string().min(8).max(30).required(),
});

module.exports = usuarioSchema;