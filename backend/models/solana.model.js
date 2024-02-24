const Joi = require('joi');

const solanaSchema = Joi.object({
    reference: Joi.string().required(),
    url: Joi.string().required(),
    memo: Joi.string().optional(),
    
});