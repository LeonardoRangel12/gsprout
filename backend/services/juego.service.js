const db = require("../configurations/db.configuration.js");

async function createJuego(data) {
    return await db.createJuego(data);
}

async function getJuegos(){
    return await db.getJuegos();
}
async function getJuegoById(id){
    return await db.getJuegoById(id);
}
async function updateJuego(id, data){
    return await db.updateJuego(id, data);
}
async function deleteJuego(id){
    return await db.deleteJuego(id);
}

async function getJuegoByName(nombre){
    return await db.getJuegoByName(nombre);
}

module.exports = {
    createJuego,
    getJuegos,
    getJuegoById,
    updateJuego,
    deleteJuego,
    getJuegoByName
}