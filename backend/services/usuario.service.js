const db = require("../configurations/db.configuration.js");

async function createUsuario(data) {
    return await db.createUsuario(data);
}

async function getUsuarios() {
    return await db.getUsuarios();
}

async function getUsuarioById(id) {
    return await db.getUsuarioById(id);
}

// async function getUsuarioByEmail(email) {
//     return await db.getUsuarioByEmail(email);
// }
// async function getUsuarioByPublicKey(publicKey) {
//     return await db.getUsuarioByPublicKey(publicKey);
// }

async function loginUsuario(username, publicKey) {
    return await db.loginUsuario(username, publicKey);
}
async function getUsuarioByUsername(publicKey) {
    return await db.getUsuarioByUsername(publicKey);
}


async function updateUsuario(email, data) {
    return await db.updateUsuario(email, data);
}

async function deleteUsuario(email) {
    return await db.deleteUsuario(email);
}
module.exports = {
    createUsuario,
    getUsuarios,
    // getUsuarioByPublicKey,
    loginUsuario,
    getUsuarioByUsername,
    getUsuarioById,
    updateUsuario,
    deleteUsuario
}