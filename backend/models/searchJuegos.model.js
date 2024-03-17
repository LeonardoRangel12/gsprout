const Joi = require('joi');
const juegoSchema = Joi.object({
    queryString: Joi.string().max(1000).optional(),
    minPrice: Joi.number().min(0.000000001).max(9999999).optional(),
    maxPrice:  Joi.number().min(0.000000001).max(9999999).optional(),
    categoriesToFilter: Joi.array().items(Joi.string()),
});
module.exports = juegoSchema;