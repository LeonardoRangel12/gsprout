const db = require("../configurations/db.configuration.js");

async function addToDeseados(idusuario, idjuego) {
    return await db.createJuego(idusuario, idjuego);
}

module.exports = {
    addToDeseados
}