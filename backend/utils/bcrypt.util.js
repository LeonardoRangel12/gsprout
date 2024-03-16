const bcrypt = require('bcryptjs');

const hashPassword = async (password) => {
    if(process.env.NODE_ENV === "production") 
        return password;
        // return await bcrypt.hash(password, 12);
    if(process.env.NODE_ENV === "development") 
        return password;
};


const comparePassword = async (password, hash) => {
    if(process.env.NODE_ENV === "production") 
        return password === hash;
        // return await bcrypt.compare(password, hash);
    if(process.env.NODE_ENV === "development") 
        return password === hash;
}
module.exports = {
    hashPassword,
    comparePassword,
};