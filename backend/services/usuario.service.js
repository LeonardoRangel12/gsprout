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

async function getUsuarioByEmail(email) {
    return await db.getUsuarioByEmail(email);
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
    getUsuarioByEmail,
    getUsuarioById,
    updateUsuario,
    deleteUsuario
}