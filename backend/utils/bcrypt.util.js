const bcrypt = require('bcrypt');

const hashPassword = async (password) => {
    if(process.env.NODE_ENV === "production") 
        return await bcrypt.hash(password, 12);
    if(process.env.NODE_ENV === "development") 
        return password;
};

module.exports = {
    hashPassword
};