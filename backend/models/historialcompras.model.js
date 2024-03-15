const joi = require('joi');
const historialComprasSchema = joi.object({
    id: joi.number().required(),
    id_usuario: joi.number().required(),
    id_juego: joi.number().required(),
    fecha: joi.date().required(),
    precio: joi.number().required(),
});
module.exports = historialComprasSchema;