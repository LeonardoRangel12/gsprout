const joi = require('joi')
const compraSchema = joi.object({
    id: joi.number().required(),
    id_usuario: joi.number().required(),
    id_juego: joi.number().required(),
    fecha: joi.date().required(),
    precio: joi.number().required().min(0.00000001),
});
module.exports = compraSchema;