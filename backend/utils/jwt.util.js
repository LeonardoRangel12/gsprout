const jwt = require('jsonwebtoken');

const secret = process.env.SECRET;

const generateToken = (payload) => {
    return jwt.sign(payload, secret, { expiresIn: '24h' });
};



module.exports = {
    generateToken,
};