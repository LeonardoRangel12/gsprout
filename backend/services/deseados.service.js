const db = require("../configurations/db.configuration.js");

async function getDeseadosByUsuario(userId) {
    return await db.getDeseadosByUsuario(userId);
}
async function createNewDeseados(userId, idjuego) {
    return await db.createNewDeseados(userId, idjuego);
}
async function addToDeseados(idusuario, idjuego) {
    return await db.addToDeseados(idusuario, idjuego);
}

async function deleteJuegoOfDeseados(userId, juegoId) {
    return await db.deleteJuegoOfDeseados(userId, juegoId);
}
module.exports = {
    addToDeseados,
    getDeseadosByUsuario,
    createNewDeseados,
    deleteJuegoOfDeseados
}