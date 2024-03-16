const Joi = require('joi');

const usuarioSchema = Joi.object({
    username: Joi.string().min(3).max(30).required(),
    email: Joi.string().email().required(),
    // password: Joi.string().required(),
    password: Joi.string().min(8).max(30).required(),
    wallets: Joi.array().items(Joi.string().min(44).max(44)).min(1).required(),
    watchList: Joi.array().items(Joi.string().min(3).max(30)).required(),
    descripcion: Joi.string().min(3).max(100).optional(),
    // horas_juego: Joi.number().min(0).optional(),
    // juego_favorito: Joi.string().min(3).max(30).optional(),
    // Stores the image in base64
    foto: Joi.binary().encoding('base64').optional(),
    
});

module.exports = usuarioSchema;