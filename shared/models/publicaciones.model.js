const joi = require('joi')
const publicacionesSchema = joi.object({
    id_usuario: joi.string().min(3).max(30).required(),
    id_juego: joi.string().min(3).max(30).required(),
    wallet: joi.string().required(),
    fecha: joi.date().iso().required(),
    precio: joi.number().required().min(0.00000001),
});
module.exports = publicacionesSchema;