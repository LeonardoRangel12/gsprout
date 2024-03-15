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
async function getUsuarioByUsername(username) {
    return await db.getUsuarioByUsername(username);
}


async function updateUsuario(username, data) {
    return await db.updateUsuario(username, data);
}

async function deleteUsuario(username) {
    return await db.deleteUsuario(username);
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