const jwt = require('jsonwebtoken');

const secret = process.env.SECRET;

const generateToken = (payload) => {
    return jwt.sign(payload, secret, { expiresIn: '24h' });
};

const verifyToken = (token) => {
    return jwt.verify(token, secret);
}

module.exports = {
    generateToken,
    verifyToken,
};