const db = require("../configurations/db.configuration.js");

async function createUsuario(data) {
    return await db.createUsuario(data);
}

async function getUsuarios() {
    return await db.getUsuarios();
}
async function getUsuarioById(email) {
    return await db.getUsuarioById(email);
}

async function updateUsuario(email, data) {
    return await db.updateUsuario(email, data);
}

async function deleteUsuario(email) {
    console.log(email)
    return await db.deleteUsuario(email);
}
module.exports = {
    createUsuario,
    getUsuarios,
    getUsuarioById,
    updateUsuario,
    deleteUsuario
}