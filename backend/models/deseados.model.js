const Joi = require('joi');

const deseadosSchema = Joi.object({
    id_usuario: Joi.string().min(3).max(30).required(),
    games_in_deseados: Joi.array().items(Joi.string()),
});

module.exports = deseadosSchema;