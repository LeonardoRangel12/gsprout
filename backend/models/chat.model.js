const joi = require('joi');
const messageSchema = joi.object({
    // Usernames
    from: joi.string().min(3).max(30).required(),
    to: joi.string().min(3).max(30).required(),
    // Content of the message
    content: joi.string().max(500).required(),
});
module.exports = messageSchema;
