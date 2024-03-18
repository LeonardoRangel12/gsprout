const joi = require('joi');
const messageSchema = joi.object({
    timestamp: joi.date().required(),
    sender: joi.string().min(3).max(30).required(),
    receiver: joi.string().min(3).max(30).required(),
    message: joi.string().max(500).required()
});
module.exports = messageSchema;
