const jwt = require('jsonwebtoken');

const secret = process.env.SECRET;

const generateToken = (payload) => {
    return jwt.sign(payload, secret, { expiresIn: '24h' });
};

const verifyToken = (token) => {
    const jwtToken = token.split(' ')[1];
    try{
        return jwt.verify(jwtToken, secret);

    }
    catch(err){        
        return null;
    }
}

module.exports = {
    generateToken,
    verifyToken,
};