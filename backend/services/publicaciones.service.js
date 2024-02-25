const db = require("../configurations/db.configuration.js");

async function createPublicacion(data) {
    return await db.createPublicacion(data);
}
async function getPublicaciones(){
    return await db.getPublicaciones();
}
async function getPublicacionById(id){
    return await db.getPublicacionById(id);
}
async function updatePublicacion(id, data){
    return await db.updatePublicacion(id, data);
}
async function deletePublicacion(id){
    return await db.deletePublicacion(id);
}


module.exports = {
    createPublicacion,
    getPublicaciones,
    getPublicacionById,
    updatePublicacion,
    deletePublicacion,
}