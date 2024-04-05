const jwt = require('jsonwebtoken');

const secret = process.env.SECRET;

const generateToken = (payload) => {
    return jwt.sign(payload, secret);
};

const verifyToken = (token) => {
    try{
        const jwtToken = token.split(' ')[1];
        console.log(jwtToken);
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